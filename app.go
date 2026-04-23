package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

// App struct
type App struct {
	ctx context.Context
}

type Result struct {
	Title  string `json:"title"`
	Result string `json:"result"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) openJson() map[string]map[string][]string {
	jsonFile, err := os.Open("dorks.json")
	if err != nil {
		fmt.Println("File could not be opened:", err)
	}
	fmt.Println("Successfully Opened dorks.json")
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		fmt.Println("Error reading file:", err)
	}

	var dork map[string]map[string][]string
	err = json.Unmarshal((byteValue), &dork)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
	}
	return dork
}

func (a *App) Dorker(input string, selectedCategory string) []Result {

	var results []Result

	dork := a.openJson()

	for option, categories := range dork {
		if option == selectedCategory {
			for category, dorks := range categories {
				for _, dork := range dorks {
					finalDork := strings.ReplaceAll(dork, "{{target}}", input)
					results = append(results, Result{
						Title:  category,
						Result: finalDork,
					})
				}
			}
		}
	}
	return results
}

func (a *App) AllDorks() map[string]map[string][]string {
	return a.openJson()

}

func (a *App) AllCategories(option string) []string {
	var categories []string
	allDork := a.openJson()

	if selectedCategories, ok := allDork[option]; ok {
		for category := range selectedCategories {
			categories = append(categories, category)
		}
	}
	return categories

}

func (a *App) AddDork(option string, category string, dork string) string {

	dorkNew := a.openJson()
	dorkNew[option][category] = append(dorkNew[option][category], dork)

	jsonData, err := json.MarshalIndent(dorkNew, "", "  ")
	if err != nil {
		return "Error: Could not convert to JSON"
	}

	err = os.WriteFile("dorks.json", jsonData, 0644)
	if err != nil {
		fmt.Println("Error writing file:", err)
		return ""
	}

	return "Dork added successfully"
}

func (a *App) DeleteDork(option string, category string, dork string) string {
	dorkDelete := a.openJson()

	if _, ok := dorkDelete[option]; ok {
		if dorks, ok := dorkDelete[option][category]; ok {
			updatedDorks := []string{}
			for _, d := range dorks {
				if d != dork {
					updatedDorks = append(updatedDorks, d)
				}
			}
			dorkDelete[option][category] = updatedDorks
		}
	}
	jsonData, _ := json.MarshalIndent(dorkDelete, "", "  ")
	os.WriteFile("dorks.json", jsonData, 0644)

	return "Dork deleted successfully!"
}
