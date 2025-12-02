package database

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB holds the global database connection instance.
var DB *gorm.DB

// Card represents the MTG card model for GORM
type Card struct {
	ID        string         `gorm:"primaryKey;type:varchar(255)"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`

	OracleID   *string  `gorm:"type:varchar(255)"`
	Name       string   `gorm:"type:varchar(500);not null"`
	ManaCost   *string  `gorm:"type:varchar(100)"`
	CMC        *float64 `gorm:"type:decimal(10,2)"`
	TypeLine   string   `gorm:"type:varchar(500);not null"`
	OracleText *string  `gorm:"type:text"`
	Power      *string  `gorm:"type:varchar(20)"`
	Toughness  *string  `gorm:"type:varchar(20)"`
	Loyalty    *string  `gorm:"type:varchar(20)"`

	// Array fields - use pq.StringArray
	Colors        pq.StringArray `gorm:"type:text[]"`
	ColorIdentity pq.StringArray `gorm:"type:text[]"`
	Keywords      pq.StringArray `gorm:"type:text[]"`

	// JSON fields stored as text
	CardFaces  *string `gorm:"type:jsonb"`
	ImageURIs  *string `gorm:"type:jsonb"`
	Legalities *string `gorm:"type:jsonb"`
	Prices     *string `gorm:"type:jsonb"`

	SetCode         string  `gorm:"type:varchar(50);not null"`
	SetName         *string `gorm:"type:varchar(500)"`
	CollectorNumber *string `gorm:"type:varchar(50)"`
	Rarity          string  `gorm:"type:varchar(50);not null"`
	Artist          *string `gorm:"type:varchar(500)"`
	FlavorText      *string `gorm:"type:text"`
	ReleasedAt      *string `gorm:"type:varchar(50)"`
	Lang            string  `gorm:"type:varchar(10);default:''"`
	CachedAt        int64   `gorm:"type:bigint;default:0"`
}

// InitializeDatabase connects to the PostgreSQL database and performs migrations.
func InitializeDatabase(models ...interface{}) {
	dsn := "host=localhost user=appuser password=@s$Fuck1337! dbname=postgres port=5432 sslmode=disable search_path=public"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		// Disable foreign key constraints during migration
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatalf("Database: Failed to connect: %v", err)
	}

	fmt.Println("Database: Connected successfully")

	// AutoMigrate should be safe - suppress the error if table exists
	if err := DB.AutoMigrate(models...); err != nil {
		// Check if it's just a "table already exists" error
		if !strings.Contains(err.Error(), "already exists") {
			log.Fatalf("Database: Failed to auto-migrate schema: %v", err)
		}
		fmt.Println("Database: Table already exists, continuing...")
	} else {
		fmt.Println("Database: Schema migrated successfully")
	}
}

func GetDB() *gorm.DB {
	return DB
}

// SearchCardByName searches for a card by exact name
func SearchCardByName(name string) (*Card, error) {
	var card Card
	result := DB.Where("name = ?", name).First(&card)
	if result.Error != nil {
		return nil, result.Error
	}
	return &card, nil
}

// SearchCardByNameFuzzy searches for cards with similar names (requires pg_trgm extension)
func SearchCardByNameFuzzy(name string) ([]Card, error) {
	var cards []Card
	result := DB.Where("name ILIKE ?", "%"+name+"%").Limit(10).Find(&cards)
	if result.Error != nil {
		return nil, result.Error
	}
	return cards, nil
}

// GetCardByID retrieves a card by its Scryfall ID
func GetCardByID(id string) (*Card, error) {
	var card Card
	result := DB.Where("id = ?", id).First(&card)
	if result.Error != nil {
		return nil, result.Error
	}
	return &card, nil
}

// UpsertCard inserts or updates a card (useful for caching Scryfall data)
func UpsertCard(card *Card) error {
	result := DB.Save(card)
	return result.Error
}
