/**
 *  Luminoso connector for Microstrategy
 * 
 * (c) 2019 Luminoso - All Rights Reserved
 * 
 * Usage:
 *   https://luminosoinsight.github.io/luminoso-bi-tool-connector/
 */

(function(){
  // mstr is a global object from mstrgdc-1.0.js, which represents the data connector framework
  var myConnector = mstr.createDataConnector();
  
  var setTableSchema = function(tableSchema, project_url, lumi_token){

    if (tableSchema.tableName=="score_drivers") {
      var sd_cols = [
        {
          name: "score_driver_name",
          dataType: mstr.dataTypeEnum.string
        },
        {
          name: "score_field",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "exact_matches",
          dataType: mstr.dataTypeEnum.int
        },
        {
          id: "conceptual_matches",
          dataType: mstr.dataTypeEnum.int
        },
        {
          id: "total_matches",
          dataType: mstr.dataTypeEnum.int
        },
        {
          id: "impact",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "confidence",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "relevance",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "importance",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "sample_text_0",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_0_id",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_1",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_1_id",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_2",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_2_id",
          dataType: mstr.dataTypeEnum.string
        }
      ];
      tableSchema.column = sd_cols;
    } // if score_drivers
    else if ((tableSchema.tableName=="docs") || (tableSchema.tableName=="metadata_mapping")) {

      // call daylight and get the metadata for the doc_table
      luminoso.get_metadata(project_url, lumi_token, function(metadata) {
        console.log("SUCCESS - got metadata");
    
        if (tableSchema.tableName=="docs") {
          // Schema for document table
          var doc_cols = [
            {
              id: "doc_id",
              dataType: mstr.dataTypeEnum.string
            },
            {
              id: "doc_text",
              dataType: mstr.dataTypeEnum.string
            },        
            {
              id: "concept",
              dataType: mstr.dataTypeEnum.string
            },        
            {
              id: "theme",
              dataType: mstr.dataTypeEnum.string
            },
            {
              id: "theme_score",
              dataType: mstr.dataTypeEnum.float
            },
            {
              id: "theme_id",
              dataType: mstr.dataTypeEnum.string
            }
          ];

          for (
            var md_schema_idx = 0;
            md_schema_idx < metadata.length;
            md_schema_idx++
          ) {
            console.log("md item = |" + metadata[md_schema_idx].t_id + "|");
            md_type = mstr.dataTypeEnum.string;
            if (
              metadata[md_schema_idx]["type"] == "score" ||
              metadata[md_schema_idx]["type"] == "number"
            ) {
              md_type = mstr.dataTypeEnum.float;
            } else if (metadata[md_schema_idx]["type"] == "date") {
              md_type = mstr.dataTypeEnum.date;
            }

            md_tmp = {
              // the name cannot have spaces
              id: metadata[md_schema_idx].t_id,
              dataType: md_type
            };
            //console.log("adding column = "+JSON.stringify(md_tmp))
            doc_cols.push(md_tmp);
          }
          tableSchema.column = doc_cols;
        } // docs table
        else if (tableSchema.tableName=="metadata_mapping") {

          // an extra table if there has been a metadata mapping created for special characters
          md_map_cols = [];
          for (
            var md_schema_idx = 0;
            md_schema_idx < metadata.length;
            md_schema_idx++
          ) {
            var md_map_cols = [
              {
                id: "metadata_id",
                dataType: mstr.dataTypeEnum.string
              },
              {
                id: "name",
                dataType: mstr.dataTypeEnum.string
              }
            ];
          } // for all metadata

          tableSchema.column = md_map_cols;
        } // if metadata_mapping
      });
    } // table docs or metadata mapping
    else if (tableSchema.tableName=="subset_key_terms") {
      // Schema for subset key terms table
      var skt_cols = [
        {
          id: "term",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "subset_id",
          dataType: mstr.dataTypeEnum.string
        },        
        {
          id: "subset_name",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "subset_value",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "exact_match",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "total_match",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "conceptual_match",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "relevance",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "sample_text_0",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_0_id",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_1",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_1_id",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_2",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "sample_text_2_id",
          dataType: mstr.dataTypeEnum.string
        }
      ];
      tableSchema.column = skt_cols;
    } // subset_key_terms
    else if (tableSchema.tableName=="subsets") {

      // Schema for subsets table
      var subsets_cols = [
        {
          id: "subset_id",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "subset_name",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "value",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "count",
          dataType: mstr.dataTypeEnum.float
        }
      ];
      tableSchema.column = subsets_cols;
    } // subsets
    else if (tableSchema.tableName=="top_concept_assoc") {

      var top_concept_assoc_cols = [
        {
          id: "concept_name",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "assoc_name",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "relevance",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "association_score",
          dataType: mstr.dataTypeEnum.float
        }
      ];
      tableSchema.column = top_concept_assoc_cols;
    } // top concept associations
    else if (tableSchema.tableName=="themes") {

      var themes_cols = [
        {
          id: "cluster_label",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "concepts",
          dataType: mstr.dataTypeEnum.string
        },
        {
          id: "match_count",
          dataType: mstr.dataTypeEnum.float
        },
        {
          id: "theme_id",
          dataType: mstr.dataTypeEnum.string
        }
      ];

      tableSchema.column = themes_cols;

    } // themes


  } // setTableSchema

  function getData(table, lumi_data, doneCallback)
  {
    project_url = lumi_data.lumi_url;
    lumi_token = lumi_data.lumi_token;

    setTableSchema(table.tableSchema,project_url, lumi_token);

    console.log("table name = "+table.tableSchema.tableName);
    
    if (table.tableSchema.tableName=="score_drivers")
    {
      luminoso.get_all_score_drivers(project_url, lumi_token, function(table_data) {

        console.log("Score driver data received.")
        table.appendFormattedData(table_data);
    
        doneCallback(table);        
      })
    }
    else if (table.tableSchema.tableName=="docs") {
      luminoso.get_docs_and_metadata(project_url, lumi_token, function(table_data){
        table.appendFormattedData(table_data);
        doneCallback(table);
      })
    }

    else if (table.tableSchema.tableName == "subset_key_terms") {
      luminoso.get_skt(project_url, lumi_token, function(skt_data){
        table.appendFormattedData(skt_data);
        doneCallback(table);
      })
    } // subset key terms table
    else if (table.tableSchema.tableName == "subsets") {
      luminoso.get_subset_info(project_url, lumi_token, function(subset_table){
        table.appendFormattedData(subset_table);
        doneCallback(table);
      })
    } // subsets table
    else if (table.tableSchema.tableName == "top_concepts_assoc") {
      luminoso.get_top_concept_assoc(project_url, lumi_token, function(concept_assoc){
        table.appendFormattedData(concept_assoc);
        doneCallback(table);
      })
    } // if top_concepts_assoc
    else if (table.tableSchema.tableName == "themes") {
      luminoso.get_themes_and_counts(project_url, lumi_token, function(theme_data){
        table.appendFormattedData(theme_data);
        doneCallback(table);
      })
    } // if top_concepts_assoc
    else if (table.tableSchema.tableName == "md_mapping") {
      luminoso.get_metadata_mapping(project_url, lumi_token, function(md_mapping){
        table.appendFormattedData(md_mapping);
        doneCallback(table);
      })
    }
    else {
      doneCallback([])
    }

  }

  // Connector must define fetchTable function
  myConnector.fetchTable = function(table, params, doneCallback) {
    console.log("FETCH TABLE!")

    // params represents information sent by connector to MSTR at interactive phase
    var mstrParams = JSON.parse(params);
    console.log("url = "+mstrParams["lumi-project-url"]);
    lumi_url_tmp = mstrParams["lumi-project-url"];
    var lumi_token_tmp;
    var lumi_username_tmp;
    var lumi_password_tmp;
    if ('luminoso-token' in mstrParams) {
      lumi_token_tmp = mstrParams['luminoso-token'];
    }
    if ('luminoso-username' in mstrParams) {
      lumi_username_tmp = mstrParams['luminoso-username'];
    }
    if ('luminoso-password' in mstrParams) {
      lumi_password_tmp = mstrParams['luminoso-password'];
    }

    // DEBUG: use a hard coded token/project
    // lumi_token_tmp = "r8mNbpq9Q98233rcz9eRkCWV4utsrJ7j";
    // lumi_url_tmp = "http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = // simple kf project
    //   "https://analytics.luminoso.com/app/projects/p87t862f/prjsvn3x";

        // clean the url
    // remove anything after a ?
    if (lumi_url_tmp.indexOf('?')>-1)
      {
      lumi_url_tmp = lumi_url_tmp.substring(0, lumi_url_tmp.indexOf('?'));
      }
    console.log("url = "+lumi_url_tmp);

    // convert an app url into an api url
    project_url = lumi_url_tmp;
    api_url = project_url.split("/app")[0] + "/api/v5";
    api_v4_url = project_url.split("/app")[0] + "/api/v4";

    // second url cleaning, remove anything past the project_id
    url_arr = project_url.split("/").slice(0,7);
    
    project_id = url_arr[url_arr.length - 1];
    account_id = url_arr[url_arr.length - 2];
    proj_apiv4 = api_url + "/projects/" + account_id + "/" + project_id;
    proj_apiv5 = api_url + "/projects/" + project_id;

    // prepend the cors proxy until this is hosted on luminoso.com
    // proxy_url = "https://cors-anywhere.herokuapp.com/";
    // proxy_url = "http://localhost:8080/";
    var proxy_url = "https://morning-anchorage-77576.herokuapp.com/";
    // var proxy_url = "";   // for hosting on luminoso.com don't use the proxy
    api_url = proxy_url + api_url;
    api_v4_url = proxy_url + api_v4_url;
    proj_apiv5 = proxy_url + proj_apiv5;
    proj_apiv4 = proxy_url + proj_apiv4;

    // if lumi_token isn't set, then probably came through the username way
    var lumi_token;
    if (!lumi_token_tmp) {
      console.log("check login user: "+lumi_username_tmp);
      if (lumi_username_tmp) {
        console.log("got pass, attempting login");
        luminoso.lumi_login(api_v4_url, lumi_username_tmp, lumi_password_tmp, function(
          token
        ) {
          console.log("GOT THE TOKEN!!!!");
          console.log("token=" + JSON.stringify(token));
          lumi_token = token;

          var lumi_data = {
            lumi_url: proj_apiv5,
            lumi_token: lumi_token
          };
          getData(table,lumi_data,doneCallback);
        });
      } else {
        console.log("ERROR no token and no username. One or other must be set");
      }
    }
    else {
      lumi_token = lumi_token_tmp;
    }

    var lumi_data = {
      lumi_url: proj_apiv5,
      lumi_token: lumi_token
    };
   getData(table,lumi_data,doneCallback);
  };
  // validateDataConnector does a validation check of the connector
  mstr.validateDataConnector(myConnector);
})();

// Create event listener for when the user submits the form

$(document).ready(function() {
  $("#submitButton").click(function() {
    var content = $("#file").val();
    mstr.connectionName = "LumiData";
    // connectionData is a JSON object. Connector can put any information here.
    console.log("READY BUTTON CLICK!")
    mstr.connectionData = {};
    mstr.connectionData.file = content;

    // MUST define tableList field. Can import multiple tables in one connection.
    mstr.tableList = [];
    mstr.tableList.push({tableName: "score_drivers"});
    mstr.tableList.push({tableName: "docs"});
    mstr.tableList.push({tableName: "subset_key_terms"});
    mstr.tableList.push({tableName: "subsets"});
    mstr.tableList.push({tableName: "top_concepts_assoc"});
    mstr.tableList.push({tableName: "themes"});
    mstr.tableList.push({tableName: "md_mapping"});

    // Inform that interactive phase is finished and send information to MSTR
    window.mstr.submit();
  });
});