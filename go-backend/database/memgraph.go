package database

import (
	"context"
	"fmt"
	"go-backend/models"
	"strings"

	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)


func processTypes(typeLine string) []string {
    // Splits "Legendary Creature — Elf Shaman" into ["Legendary", "Creature", "Elf", "Shaman"]
    clean := strings.ReplaceAll(typeLine, " — ", " ")
    return strings.Fields(clean)
}

func derefString(s *string) string {
    if s == nil { return "" }
    return *s
}

func derefFloat(f *float64) float64 {
    if f == nil { return 0.0 }
    return *f
}

func GetCardSuggestions(oracleID string) ([]models.Card, error) {
	ctx := context.Background()
	session := GraphDriver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
	defer session.Close(ctx)

	// 1. Execute the Graph Search
	result, err := session.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (interface{}, error) {
		cypher := `
			MATCH (source:Card {id: $id})
			MATCH (source)-[:PRODUCES|HAS_KEYWORD|IS_TYPE]->(attr)
			MATCH (rec:Card)-[:PRODUCES|HAS_KEYWORD|IS_TYPE]->(attr)
			WHERE rec.id <> source.id
			WITH rec, count(DISTINCT attr) AS sharedCount
			ORDER BY sharedCount DESC
			LIMIT 10
			RETURN rec.id AS id
		`
		res, err := tx.Run(ctx, cypher, map[string]interface{}{"id": oracleID})
		if err != nil {
			return nil, err
		}

		var ids []string
		for res.Next(ctx) {
			if id, ok := res.Record().Get("id"); ok {
				ids = append(ids, id.(string))
			}
		}
		return ids, nil
	})

	if err != nil {
		return nil, fmt.Errorf("graph search failed: %w", err)
	}

	suggestedIDs := result.([]string)
	if len(suggestedIDs) == 0 {
		return []models.Card{}, nil
	}

    // 1. Fetch the cards from Postgres
    var cards []models.Card
    if err := DB.Where("oracle_id IN ?", suggestedIDs).Where("lang = ?", "en").Find(&cards).Error; err != nil {
        return nil, err
    }

    // 2. Map cards by their ID for quick lookup
    cardMap := make(map[string]models.Card)
    for _, card := range cards {
        cardMap[*card.OracleID] = card
    }

    // 3. Rebuild the slice in the EXACT order of suggestedIDs
    orderedCards := make([]models.Card, 0, len(suggestedIDs))
    for _, id := range suggestedIDs {
        if card, exists := cardMap[id]; exists {
            orderedCards = append(orderedCards, card)
        }
    }

    return orderedCards, nil
}

func syncToMemgraph(cards []*models.Card) error {
    ctx := context.Background()
    session := GraphDriver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
    defer session.Close(ctx)

    // Prepare a "lean" map for Memgraph ingestion
    var batchData []map[string]interface{}
    for _, c := range cards {
		if c.OracleID == nil { continue }
        batchData = append(batchData, map[string]interface{}{
            "id":          c.OracleID,
            "name":        c.Name,
            "manaCost":    derefString(c.ManaCost),
            "cmc":         derefFloat(c.CMC),
            "typeLine":    c.TypeLine,
            "types":       processTypes(c.TypeLine),
            "keywords":    c.Keywords,
            "mechanics":   extractMechanics(derefString(c.OracleText)),
        })
    }

    // The "Power Query": Updates nodes and relationships in one go
    _, err := session.ExecuteWrite(ctx, func(tx neo4j.ManagedTransaction) (interface{}, error) {
        query := `
        UNWIND $batch AS data
        MERGE (c:Card {id: data.id})
        SET c.name = data.name, c.cmc = data.cmc
        
        // Connect Types
        WITH c, data
        UNWIND data.types AS tName
        MERGE (t:Type {name: tName})
        MERGE (c)-[:IS_TYPE]->(t)
        
        // Connect Keywords
        WITH c, data
        UNWIND data.keywords AS kName
        MERGE (k:Keyword {name: kName})
        MERGE (c)-[:HAS_KEYWORD]->(k)
        
        // Connect Mechanics
        WITH c, data
        UNWIND data.mechanics AS mName
        MERGE (m:Mechanic {name: mName})
        MERGE (c)-[:PRODUCES]->(m)
        `
        return tx.Run(ctx, query, map[string]interface{}{"batch": batchData})
    })

    return err
}

func GetMemgraphCardCount() int64 {
	ctx := context.Background()
	session := GraphDriver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
	defer session.Close(ctx)

	result, err := session.Run(ctx, "MATCH (c:Card) RETURN count(c) as count", nil)
	if err != nil {
		return 0
	}

	if result.Next(ctx) {
		val, _ := result.Record().Get("count")
		return val.(int64)
	}
	return 0
}


// This is what needs to get smart.
// Maybe we throw a llm at this too?
func extractMechanics(oracleText string) []string {
	mechanics := []string{}
	text := strings.ToLower(oracleText)

	// Simple pattern matching for core synergies
	mapping := map[string][]string{
		"Draw":      {"draw a card", "draws a card"},
		"Ramp":      {"search your library for a land", "add {g}", "add {u}", "add {r}", "add {b}", "add {w}"},
		"Token":     {"create", "token"},
		"Lifegain":  {"gain", "life"},
		"Graveyard": {"return", "graveyard", "exile from your graveyard"},
	}

	for mech, keywords := range mapping {
		for _, kw := range keywords {
			if strings.Contains(text, kw) {
				mechanics = append(mechanics, mech)
				break 
			}
		}
	}
	return mechanics
}

func executeSchema(ctx context.Context) {
	session := GraphDriver.NewSession(ctx, neo4j.SessionConfig{})
	defer session.Close(ctx)

	queries := []string{
		"CREATE CONSTRAINT ON (c:Card) ASSERT c.id IS UNIQUE;",
		"CREATE INDEX ON :Type(name);",
		"CREATE INDEX ON :Keyword(name);",
		"CREATE INDEX ON :Mechanic(name);",
	}

	for _, q := range queries {
		session.Run(ctx, q, nil)
	}
}