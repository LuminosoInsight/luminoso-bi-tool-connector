(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Schema for score_driver table
        var sd_cols = [
            {
            id: "score_driver_name",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "exact_matches",
            dataType: tableau.dataTypeEnum.int
            },
            {
            id: "conceptual_matches",
            dataType: tableau.dataTypeEnum.int
            },
            {
            id: "total_matches",
            dataType: tableau.dataTypeEnum.int
            },
            {
            id: "impact",
            dataType: tableau.dataTypeEnum.float
            },
            {
            id: "confidence",
            dataType: tableau.dataTypeEnum.float
            },
            {
            id: "relevance",
            dataType: tableau.dataTypeEnum.float
            },
            {
            id: "importance",
            dataType: tableau.dataTypeEnum.float
            },
            {
            id: "sample_text_0",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "sample_text_0_id",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "sample_text_1",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "sample_text_1_id",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "sample_text_2",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "sample_text_2_id",
            dataType: tableau.dataTypeEnum.string
            }];

        var scoreDriverTable = {
            id: "scoredrivers",
            alias: "ScoreDrivers",
            columns: sd_cols
        };
/*
        // Schema for document table
        var doc_cols = [
            {
            id: "doc_id",
            dataType: tableau.dataTypeEnum.string
            },
            {
            id: "doc_text",
            dataType: tableau.dataTypeEnum.string
            }
        ];

        var docTable = {
            id: "docs",
            alias: "Documents",
            columns: doc_cols
        };
*/
        schemaCallback([scoreDriverTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //if (table["tableInfo"]["id"] == "scoredrivers") {
            
                  var tableData = []
                  tableData.push({
                    score_driver_name: 'test',
                    exact_matches: 100,
                    conceptual_matches:
                      75,
                    total_matches: 25})
                    table.appendRows(tableData);
                    doneCallback()
        //          }

    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
