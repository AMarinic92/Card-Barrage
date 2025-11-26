package handlers
import (
    "encoding/json"
    "net/http"
    // "github.com/gorilla/mux"
)

type TestType struct {
	Name string
	Id int
	Inventory []int
}

func GetTest(w http.ResponseWriter, r *http.Request){
	test := TestType{Name: "test", Id: 12, Inventory: []int{}}
	w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(test)
}