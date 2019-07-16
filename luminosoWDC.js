/**
 * Luminoso webdata connector for Tableau
 * 
 * A Tableau web data connector (WDC) that connects to Luminoso Daylight
 * 
 * License: See LICENSE file
 * (c) copyright 2019 Luminoso Technologies, Inc 
 */

(function() {

  /**
   * The tableau connector interface functions.
   *
   * http://tableau.github.io/webdataconnector/docs/
   */
  var luminosoConnector = tableau.makeConnector();

  /**
   * getSchema is called by the Tableau wdc and returns the table information
   *
   * This makes a call out to Daylight to get the doc_table metadata because
   * that may change between projects
   */
  luminosoConnector.getSchema = function(schemaCallback) {
    console.log("GET SCHEMA!");

    lumi_data = JSON.parse(tableau.connectionData);
    //console.log("sch connect data=" + lumi_data);

    // get the url from the user
    project_url = lumi_data.lumi_url;
    console.log("sch REAL URL=" + project_url);

    // get the toke
    lumi_token = lumi_data.lumi_token;

    // call daylight and get the metadata for the doc_table
    luminoso.get_metadata(project_url, lumi_token, function(metadata) {
      console.log("SUCCESS - got metadata");

      // Schema for score_driver table
      var sd_cols = [
        {
          id: "score_driver_name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "score_field",
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
        }
      ];

      var scoreDriverTable = {
        id: "score_drivers",
        alias: "ScoreDrivers",
        columns: sd_cols
      };

      // Schema for document table
      var doc_cols = [
        {
          id: "doc_id",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "doc_text",
          dataType: tableau.dataTypeEnum.string
        },        
        {
          id: "concept",
          dataType: tableau.dataTypeEnum.string
        },        
        {
          id: "theme",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "theme_score",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "theme_id",
          dataType: tableau.dataTypeEnum.string
        }
      ];

      console.log("metadata=" + JSON.stringify(metadata));
      for (
        var md_schema_idx = 0;
        md_schema_idx < metadata.length;
        md_schema_idx++
      ) {
        tableau.log("md item = |" + metadata[md_schema_idx].t_id + "|");
        md_type = tableau.dataTypeEnum.string;
        if (
          metadata[md_schema_idx]["type"] == "score" ||
          metadata[md_schema_idx]["type"] == "number"
        ) {
          md_type = tableau.dataTypeEnum.float;
        } else if (metadata[md_schema_idx]["type"] == "date") {
          md_type = tableau.dataTypeEnum.date;
        }

        md_tmp = {
          // the name cannot have spaces
          id: metadata[md_schema_idx].t_id,
          dataType: md_type
        };
        //console.log("adding column = "+JSON.stringify(md_tmp))
        doc_cols.push(md_tmp);
      }

      var docTable = {
        id: "docs",
        alias: "Documents",
        columns: doc_cols
      };

      // an extra table if there has been a metadata mapping created for special characters
      md_map_cols = [];
      if (metadata.has_id_mapping) {
        var md_map_cols = [
          {
            id: "metadata_id",
            dataType: tableau.dataTypeEnum.string
          },
          {
            id: "name",
            dataType: tableau.dataTypeEnum.string
          }
        ];

        var md_map_table = {
          id: "md_mapping",
          alias: "Metadata Name Mapping",
          columns: md_map_cols
        };
      } // if there is a metadata mapping

      // Schema for subset key terms table
      var skt_cols = [
        {
          id: "term",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "subset_id",
          dataType: tableau.dataTypeEnum.string
        },        
        {
          id: "subset_name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "subset_value",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "exact_match",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "total_match",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "conceptual_match",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "relevance",
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
        }
      ];

      var skt_table = {
        id: "subset_key_terms",
        alias: "Subset Key Terms",
        columns: skt_cols
      };

      // Schema for score_driver table
      var subsets_cols = [
        {
          id: "subset_id",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "subset_name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "value",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "count",
          dataType: tableau.dataTypeEnum.float
        }
      ];

      var subsets_table = {
        id: "subsets",
        alias: "Subsets Table",
        columns: subsets_cols
      };

      var top_concept_assoc_cols = [
        {
          id: "concept_name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "assoc_name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "relevance",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "association_score",
          dataType: tableau.dataTypeEnum.float
        }
      ];

      var top_concept_assoc_table = {
        id: "top_concepts_assoc",
        alias: "Top Concept Associations Table",
        columns: top_concept_assoc_cols
      };

      var themes_cols = [
        {
          id: "cluster_label",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "concepts",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "match_count",
          dataType: tableau.dataTypeEnum.float
        },
        {
          id: "theme_id",
          dataType: tableau.dataTypeEnum.string
        }
      ];
      var themes_table = {
        id: "themes",
        alias: "Themes",
        columns: themes_cols
      };

      // if there is a metadata mapping involved add that table
      if (md_map_cols.length > 0) {
        schemaCallback([
          docTable,
          scoreDriverTable,
          skt_table,
          subsets_table,
          top_concept_assoc_table,
          themes_table,
          md_map_table
        ]);
      } else {
        schemaCallback([
          docTable,
          scoreDriverTable,
          skt_table,
          subsets_table,
          top_concept_assoc_table,
          themes_table
        ]);
      }
    }); // get_metadata callback
  }; // getSchema

  /**
   * Tableau WDC calls the getData function when a user presses update
   * The table name to retrieve is passed in the table_id
   */
  luminosoConnector.getData = function(table, doneCallback) {
    tableau.log("GetData");
    tableau.log("table_id=" + table["tableInfo"]["id"]);
    console.log("Starting proxy fetch");

    lumi_data = JSON.parse(tableau.connectionData);
    console.log("connect data=" + lumi_data);

    project_url = lumi_data.lumi_url;
    lumi_token = lumi_data.lumi_token;

    console.log("proj_url=" + project_url);

    if (table["tableInfo"]["id"] == "score_drivers") {
      luminoso.get_all_score_drivers(project_url, lumi_token, function(table_data) {

      table.appendRows(table_data);
      doneCallback();
      })

    } // if score_drivers
    else if (table["tableInfo"]["id"] == "docs") {
      luminoso.get_docs_and_metadata(project_url, lumi_token, function(table_data){
        table.appendRows(table_data);
        doneCallback();
      })
    } // if docs table
    else if (table["tableInfo"]["id"] == "subset_key_terms") {
      luminoso.get_skt(project_url, lumi_token, function(skt_data){
        table.appendRows(skt_data);
        doneCallback();
      })
    } // subset key terms table
    else if (table["tableInfo"]["id"] == "subsets") {
      luminoso.get_subset_info(project_url, lumi_token, function(subset_table){
        table.appendRows(subset_table);
        doneCallback();
      })
    } // subsets table
    else if (table["tableInfo"]["id"] == "top_concepts_assoc") {
      luminoso.get_top_concept_assoc(project_url, lumi_token, function(concept_assoc){
        table.appendRows(concept_assoc);
        doneCallback();
      })
    } // if top_concepts_assoc
    else if (table["tableInfo"]["id"] == "themes") {
      luminoso.get_themes_and_counts(project_url, lumi_token, function(theme_data){
        table.appendRows(theme_data);
        doneCallback();
      })
    } // if top_concepts_assoc
    else if (table["tableInfo"]["id"] == "md_mapping") {
      luminoso.get_metadata_mapping(project_url, lumi_token, function(md_mapping){
        table.appendRows(md_mapping);
        doneCallback();
      })
    }
  }; // getData

  tableau.registerConnector(luminosoConnector);
})(); // register connectionName

$(document).ready(function() {
  $("#submitButton").click(function() {
    var lumi_url_tmp = $("#lumi-project-url")
      .val()
      .trim();
    var lumi_token_tmp = $("#lumi-token").val();
    var lumi_username_tmp = $("#lumi-username").val();
    var lumi_password_tmp = $("#lumi-password").val();

    // DEBUG:
    // Test urls, these are much faster when testing!
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/pr35fd6m"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/m76u733n/prn85rp4?suggesting=false"
    // lumi_token_tmp = "5kvQ1i8eQagQVE4se_k3BiLWvOV1MfS1";
    // lumi_url_tmp = "http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = // simple kf project
    //   "https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2";
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/u22n473c/prgsqc5b"
    // lumi_token_tmp = "fGpZVIxEGxtRhd6CrnWRABt9oWv3890U"
    // lumi_url_tmp =
    //  "https://analytics.luminoso.com/app/projects/j48f473w/prwx3z7n";
    // lumi_token_tmp = "WS2yW-gr-K7Arz4_jPsNUrvB9HfXE5D1";

    // https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2
    // "b42XHQHAGABA9zgRfnFZvhdI2ZnKFu5W"
    //
    // Japanese project
    //lumi_token_tmp = "amrgKfR6nkZEdgotS54Lu-m8S1pASC4m";
    //lumi_url_tmp =
    //  "https://analytics.luminoso.com/app/projects/s85p278m/pr4mcps7";
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/s85p278m/pr4ckpjs"

    // bad urls for testing
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2/compare?concepts=top&match_type=total&sortby=default&count=50"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2?filter=%5B1%2C%5B%5B%22review%22%2C%5B1%2C2%5D%5D%5D%5D"
    
    // clean the url
    // remove anything after a ?
    if (lumi_url_tmp.indexOf('?')>-1)
      {
      lumi_url_tmp = lumi_url_tmp.substring(0, lumi_url_tmp.indexOf('?'));
      }
    tableau.log("url = "+lumi_url_tmp);

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
    if (!lumi_token_tmp) {
      if (lumi_username_tmp) {
        luminoso.lumi_login(api_v4_url, lumi_username_tmp, lumi_password_tmp, function(
          token
        ) {
          tableau.log("GOT THE TOKEN!!!!");
          tableau.log("token=" + JSON.stringify(token));
          lumi_token_tmp = token;

          tableau_submit(proj_apiv5, lumi_token_tmp);
        });
      } else {
        tableau.log("ERROR no token and no username. One or other must be set");
      }
    } else {
      tableau_submit(proj_apiv5, lumi_token_tmp);
    }
  }); // submit button click

  /**
   * Calls the tableau submit.
   *
   * Description.
   * This starts the whole process. It was split into a function because the
   * login process is async and calls it after it gets a token and if a token
   * is given in the UI then it simply calls this directly to kick off the connector
   *
   * @param {*} lumi_project_url - The Luminoso Daylight v5 project api url
   * @param {*} lumi_token  - The security token to use
   */

  function tableau_submit(lumi_project_url, lumi_token) {
    var lumiDataObj = {
      lumi_url: lumi_project_url,
      lumi_token: lumi_token
    };

    tableau.log("lumi-url=" + lumiDataObj.lumi_url);

    tableau.connectionData = JSON.stringify(lumiDataObj);
    tableau.connectionName = "Luminoso Data";
    tableau.submit();

    tableau.log("a SUBMIT PRESSED!!");
  } // tableau submit

}); // document ready
