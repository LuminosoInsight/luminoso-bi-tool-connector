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
    get_metadata(project_url, lumi_token, function(metadata) {
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
        }
      ];

      console.log("metadata=" + JSON.stringify(metadata));
      for (
        var md_schema_idx = 0;
        md_schema_idx < metadata.length;
        md_schema_idx++
      ) {
        //console.log("md item = "+metadata[md_schema_idx]['name']);
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
          id: metadata[md_schema_idx]["name"],
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

      schemaCallback([docTable, scoreDriverTable]);
    }); // get_metadata
  }; // getSchema


  /**
   * Add url parameters
   *
   * Description.
   * While Javascript includes functions to do this,
   * tableau desktop doesn't support url.searchParam.append
   * so had to write the function. super annoying.
   *
   * @param {string} url - the url to append the parameter/value to
   * @param {string} param - parameter name to use
   * @param {string} value - parameter value
   *
   */
  function addParameterToURL(url, param, value) {
    // console.log("addparam url=" + url);
    // console.log("encode of value for "+String(param)+" = "+String(encodeURIComponent(value)))
    url =
      url +
      (url.split("?")[1] ? "&" : "?") +
      param +
      "=" +
      encodeURIComponent(value);
    return url;
  }

function luminoso_login(proj_api_v4, lumi_loginid, lumi_password, login_callback) {
  console.log("api url=" + proj_api_v4);

  /*
  // create the url object
  var url = proj_api_v4 + "/users/login/";
  url = addParameterToURL(url,"username",lumi_loginid);
  url = addParameterToURL(url,"password",lumi_password);

  console.log("login url=" + url);

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(resp_data) {
      console.log("login SUCCESS");
      console.log("login response = "+resp_data);
      login_callback(resp_data);
    },
    error: function(xhr, status, text) {
      console.log("ERROR getting metadata: " + status);
      console.log("error text = " + text);

      var response = $.parseJSON(xhr.responseText);
      if (response) console.log(response.error);
    },
    beforeSend: setHeader
  });

  function setHeader(xhr) {
    xhr.setRequestHeader("lumi", "lumi-cors");
  }
  */
 
} // luminoso login


  /**
   * Get project metadata
   *
   * Description.
   * Get the list of metadata fields for this project
   *
   * @param {string} proj_api - the Daylight url
   * @param {string} lumi_token  - the security token from the UI User settings/API tokens
   * @param {function} md_callback - call back after the data is received
   *
   */
  function get_metadata(proj_api, lumi_token, md_callback) {
    // create the url object
    var url = proj_api + "/metadata/";
    console.log("metadata url=" + url);
    console.log("lumi_token=" + lumi_token);
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("metadata SUCCESS");

        md_callback(resp_data.result);
      },
      error: function(xhr, status, text) {
        console.log("ERROR getting metadata: " + status);
        console.log("error text = " + text);

        var response = $.parseJSON(xhr.responseText);
        if (response) console.log(response.error);
      },
      beforeSend: setHeader
    });

    function setHeader(xhr) {
      xhr.setRequestHeader("Authorization", "Token " + lumi_token);
      xhr.setRequestHeader("lumi", "lumi-cors");
    }
  }

  /**
   * Get score drivers for field
   *
   * Description.
   * Call Daylight and get the score_drivers for the score_field.
   *
   * @param {*} proj_api - The Daylight project url
   * @param {*} md_idx - the current metadata field index
   * @param {*} score_field - the score field to use to calcualte the score_driver
   * @param {*} sd_callback - the callback after data received
   *
   * TODO: This needs to be refactored for lumi_token as param. currently global which is dangerous
   */
  function get_score_drivers(proj_api, md_idx, score_field, sd_callback) {
    // create the url object
    //var url = new URL(
    //  proj_apiv5+"/concepts/score_drivers/"
    //);
    var url = proj_api + "/concepts/score_drivers/";

    var tableData = [];

    // create the params for the score_drivers call
    var params = {
      score_field: score_field,
      concept_selector: JSON.stringify({ type: "top", limit: 40 })
    };
    Object.keys(params).forEach(function(key) {
      //url.searchParams.append(key, params[key])
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    console.log("score_drivers url: " + url);

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("SUCCESS");
        //console.log("resp="+JSON.stringify(resp_data));
        sd_callback(resp_data, md_idx);
      },
      error: function() {
        console.log("ERROR getting data");
      },
      beforeSend: setHeader
    });

    function setHeader(xhr) {
      xhr.setRequestHeader("Authorization", "Token " + lumi_token);
      xhr.setRequestHeader("lumi", "lumi-cors");
    }
  }

  /**
   * Get the fields which are type score or number
   *
   * Description.
   * This returns the list of metadata fields which can and will be
   * processed as score drivers.
   *
   * @param {string} proj_api - the Daylight project url
   * @param {string} sf_callback  - the callback after data received
   *
   * TODO: add lumi_token as a param, dangerous as used globally
   */
  function get_score_fields(proj_api, sf_callback) {
    // create the url object
    var url = proj_api + "/metadata/";
    console.log("metadata url=" + url);
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("metadata SUCCESS");
        //console.log('md_result='+JSON.stringify(resp_data));
        result = resp_data.result;
        //console.log('result='+JSON.stringify(result));
        //console.log('len='+result.length);

        var metadata = [];
        for (var md_resp_idx = 0; md_resp_idx < result.length; md_resp_idx++) {
          //console.log('it x');
          //console.log("checking name="+result[md_resp_idx]['name']+"  type="+result[md_resp_idx]['type']);
          if (
            result[md_resp_idx]["type"] == "score" ||
            result[md_resp_idx]["type"] == "number"
          ) {
            metadata.push(result[md_resp_idx]);
          }
        }
        //console.log('metadata='+JSON.stringify(metadata));
        sf_callback(metadata);
      },
      error: function() {
        console.log("ERROR getting score fields list");
      },
      beforeSend: setHeader
    });

    function setHeader(xhr) {
      xhr.setRequestHeader("Authorization", "Token " + lumi_token);
      xhr.setRequestHeader("lumi", "lumi-cors");
    }
  }

  /**
   * Read three documents from Daylight based on concept_list
   *
   * Description
   * Read three documents based on the concept_list
   * used for the score drivers dataset
   *
   * @param {string} proj_api - the Dalight project url
   * @param {int} md_idx - the index of the current metadata item these documents are for
   * @param {list} [concept_list] - the list of concepts - comes directly from score driver output
   * @param {int} idx - the indes of the current score driver these are fore
   * @param {list} [sd_data] - the score_driver data
   * @param {function} doc_callback - the callback after the docs have been received
   *
   * TODO: add lumi_token as a param, dangerous as used globally
   */
  function get_three_docs(
    proj_api,
    md_idx,
    concept_list,
    idx,
    sd_data,
    doc_callback
  ) {
    // create the url object
    var url = proj_api + "/docs/";

    // create the params for the docs call
    var params = {
      limit: "3",
      search: JSON.stringify({ texts: concept_list })
    };

    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("3docs SUCCESS");
        //console.log("resp idx="+idx+"  "+JSON.stringify(concept_list));
        doc_callback(idx, sd_data, md_idx, resp_data.result);
      },
      error: function() {
        console.log("ERROR getting data");
      },
      beforeSend: setHeader
    });

    function setHeader(xhr) {
      xhr.setRequestHeader("Authorization", "Token " + lumi_token);
      xhr.setRequestHeader("lumi", "lumi-cors");
    }
  } // get three docs

  /**
   * Get a group of documents at offset of size limit.
   *
   * Description.
   * This will read a limit at offset block of documents
   * it will call the doc_callback once those are complete
   * the doc_all_callback can be used on the upstream callback
   * to kick off the next offset read or finish with the doc_all_callback
   *
   * @param {string} proj_api
   * @param {string} lumi_token - a token from the Daylight UI
   * @param {int} offset - offset where to read the first doc
   * @param {int} limit - the number of docs to read on this pass
   * @param {list} [doc_list] - a list where to store the documents
   * @param {function} doc_all_callback - called after all docs read - not called here
   * @param {function} doc_callback - called when limit docs have been read
   */
  function get_docs(
    proj_api,
    lumi_token,
    offset,
    limit,
    doc_list,
    doc_all_callback,
    doc_callback
  ) {
    // create the url object
    var url = proj_api + "/docs/";
    console.log("metadata url=" + url);
    //console.log("lumi_token=" + lumi_token);
    console.log("offset=" + offset);
    console.log("limit=" + limit);

    // create the params for the score_drivers call
    var params = {
      offset: offset,
      limit: limit
    };
    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("docs SUCCESS");
        //console.log("docs 0 "+JSON.stringify(resp_data))
        //console.log("resp len = "+resp_data.result.length);

        doc_list.push.apply(doc_list, resp_data.result);
        doc_callback(
          proj_api,
          lumi_token,
          offset,
          limit,
          doc_list,
          resp_data.result,
          doc_all_callback
        );
      },
      error: function(xhr, status, text) {
        console.log("ERROR getting docs");
        console.log("error text = " + text);

        var response = $.parseJSON(xhr.responseText);
        if (response) console.log(response.error);
      },
      beforeSend: function(request, offset, limit) {
        request.setRequestHeader("Authorization", "Token " + lumi_token);
        request.setRequestHeader("lumi", "lumi-cors");
      }
    });
  } // get docs - with offset/limit

  /**
   * Get all the documents at a url.
   *
   * Description.
   * this kicks off the get all calls by calling get_docs
   * there are two callbacks, one when all the documents
   * are read (none returned on an api call) and the other
   * when a block of size "limit" is read
   *
   * @param {string} proj_api - The Luminoso Daylight project api
   * @param {string} lumi_token - The Daylight token from the UI User Settings/API Tokens
   * @param {function} doc_all_callback - The function called after all docs have been read
   */
  function get_all_docs(proj_api, lumi_token, doc_all_callback) {
    var offset = 0;
    var limit = 1000;
    var ret_docs = [];

    // this will setup a call to call itself (get_docs) again and again  until all docs downloaded
    get_docs(
      proj_api,
      lumi_token,
      offset,
      limit,
      ret_docs,
      doc_all_callback,
      get_docs_callback
    );
  }

  /**
   * Callback for get_all_docs
   *
   * Description
   * This is a somewhat recursive callback in that it keeps
   * calling get_docs until the results are empty
   *
   * @param {string} proj_api - The Luminoso Daylight project api
   * @param {string} lumi_token - The Daylight token from the UI User Settings/API Tokens
   * @param {int} offset - offset where to read the first doc
   * @param {int} limit - the number of docs to read on this pass
   * @param {list} [doc_list] - a list where to store the documents
   * @param {list} [resp_data] - the list of docs retried. They are already in doc_list
   * @param {function} doc_all_callback - called after all docs read - called if resp_data.len <0
   */
  function get_docs_callback(
    proj_api,
    lumi_token,
    offset,
    limit,
    doc_list,
    resp_data,
    doc_all_callback
  ) {
    if (resp_data.length > 0) {
      //if ((resp_data.length>0) && (offset<8000)) {  // good for testing
      offset = offset + limit;
      console.log("getting more docs at offset = " + offset);
      get_docs(
        proj_api,
        lumi_token,
        offset,
        limit,
        doc_list,
        doc_all_callback,
        get_docs_callback
      );
    } else {
      doc_all_callback(doc_list);
    }
  }

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
      get_score_fields(project_url, function(metadata) {
        console.log("SUCCESS - got score fields");
        for (var md_idx = 0; md_idx < metadata.length; md_idx++) {
          //console.log("md val = " + metadata[md_idx].name);

          get_score_drivers(
            project_url,
            md_idx,
            metadata[md_idx]["name"],
            function(sd_data, md_idx) {
              var tableData = [];
              var rows_complete = 0;
              // this is the actual data return
              // console.log("gsd Callback from got_score_drivers");
              //console.log(JSON.stringify(sd_data));
              for (var idx = 0; idx < sd_data.length; idx++) {
                // do a second fetch for some sample docs
                get_three_docs(
                  project_url,
                  md_idx,
                  sd_data[idx].texts,
                  idx,
                  sd_data,
                  function(idx_inner, sd_data, md_idx, doc_data) {
                    console.log("3ds callback from get_three_docs");

                    tableData.push({
                      score_driver_name: sd_data[idx_inner].name,
                      score_field: metadata[md_idx].name,
                      exact_matches: sd_data[idx_inner].exact_match_count,
                      conceptual_matches:
                        sd_data[idx_inner].match_count -
                        sd_data[idx_inner].exact_match_count,
                      total_matches: sd_data[idx_inner].match_count,
                      impact: sd_data[idx_inner].impact,
                      confidence: sd_data[idx_inner].confidence,
                      relevance: sd_data[idx_inner].relevance,
                      importance: sd_data[idx_inner].importance,
                      sample_text_0: doc_data[0].text,
                      sample_text_0_id: doc_data[0].doc_id,
                      sample_text_1: doc_data[1].text,
                      sample_text_1_id: doc_data[1].doc_id,
                      sample_text_2: doc_data[2].text,
                      sample_text_2_id: doc_data[2].doc_id
                    });

                    // count the number of rows returned
                    rows_complete++;

                    // append and callback when all rows are received
                    if (rows_complete >= sd_data.length) {
                      table.appendRows(tableData);

                      console.log(
                        "DONE. tableData=" + JSON.stringify(tableData)
                      );
                      console.log("len tableData = " + tableData.length);

                      doneCallback();
                    }
                  }
                ); // get three docs
              } // for each sd result
            } // get score drivers callback function
          ); // get score drivers function call
        } // for each metadata score field
      }); // get meta data
    } // if score_drivers
    else if (table["tableInfo"]["id"] == "docs") {
      console.log("getting docs data");

      var tableData = [];
      /*
      // good for testing purposes if you just want to see somehting sent to client
      tableData.push({
        doc_id: 'OEPSOE-IDEKKD-MCDJD-DKEMDKD',
        doc_text: "This is a test doc",
        date: "10/11/12",
        review: 5,
        sentiment: "positive",
        "sentiment_score":0.45})
        table.appendRows(tableData);
        doneCallback()
        */
      get_all_docs(project_url, lumi_token, function(doc_table) {
        console.log("SUCCESS - got docs");
        //console.log("docs = "+JSON.stringify(doc_table));
        console.log("FINALE num docs = " + doc_table.length);
        for (var d_idx = 0; d_idx < doc_table.length; d_idx++) {
          // console.log("doc cur=" + JSON.stringify(doc_table[d_idx]));
          var new_row = {
            doc_id: doc_table[d_idx].doc_id,
            doc_text: doc_table[d_idx].text
          };

          if (doc_table[d_idx].metadata) {
            // copy all the metadata for this document to the row
            for (
              var md_idx = 0;
              md_idx < doc_table[d_idx].metadata.length;
              md_idx++
            ) {
              new_row[doc_table[d_idx].metadata[md_idx].name] =
                doc_table[d_idx].metadata[md_idx].value;
            }
          }

          tableData.push(new_row);
        }
        table.appendRows(tableData);
        doneCallback();
      }); // get docs callback
    } // if docs table
  }; // getData

  tableau.registerConnector(luminosoConnector);
})(); // register connectionName

$(document).ready(function() {


  $("#submitButton").click(function() {

    var lumi_url_tmp = $("#lumi-project-url").val().trim();
    var lumi_token_tmp = $("#lumi-token").val();
    var lumi_username_tmp = $("#lumi-username").val();
    var lumi_password_tmp = $("#lumi-password").val();

    // DEBUG:
    // Test urls, these are much faster when testing!
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_token_tmp = "0Cr7-TIYLTEsynXW1wFiHTAOsUlUFX2h";
    // lumi_url_tmp = "http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp= "https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2";

    // https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2
    // "0Cr7-TIYLTEsynXW1wFiHTAOsUlUFX2h"

    // convert an app url into an api url
    project_url = lumi_url_tmp;
    api_url = project_url.split("/app")[0] + "/api/v5";
    api_v4_url = project_url.split("/app")[0] + "/api/v4";
    url_arr = project_url.split("/");
    project_id = url_arr[url_arr.length - 1];
    account_id = url_arr[url_arr.length - 2];
    proj_apiv4 = api_url + "/projects/" + account_id + "/" + project_id;
    proj_apiv5 = api_url + "/projects/" + project_id;

    // prepend the cors proxy until this is hosted on luminoso.com
    // proxy_url = "https://cors-anywhere.herokuapp.com/";
    // proxy_url = "http://localhost:8080/";
    var proxy_url = "https://morning-anchorage-77576.herokuapp.com/";
    api_url = proxy_url+api_url;
    api_v4_url = proxy_url+api_v4_url;
    proj_apiv5 = proxy_url + proj_apiv5;
    proj_apiv4 = proxy_url + proj_apiv4;

    // if lumi_token isn't set, then probably came through the username way
    if (!lumi_token_tmp)
    {
      if (lumi_username_tmp)
      {
        lumi_login(api_v4_url,lumi_username_tmp,lumi_password_tmp,function(token) {
          tableau.log("GOT THE TOKEN!!!!");
          tableau.log("token="+JSON.stringify(token));
          lumi_token_tmp = token;

          tableau_submit(proj_apiv5,lumi_token_tmp);
        });
      }
      else
      {
        tableau.log("ERROR no token and no username. One or other must be set");
      }
    }
    else
    {
      tableau_submit(proj_apiv5,lumi_token_tmp);
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

  function tableau_submit(lumi_project_url,lumi_token) {

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

  /**
   * Login to Luminoso Daylight and receive a token
   * 
   * Description
   * This uses a v4 endpoint to login to the Daylight server and get a token.
   * The token will be used for the rest of the connections
   * 
   * @param {*} proj_api_v4 | Login requires a v4 endpoint
   * @param {*} lumi_loginid | The login id
   * @param {*} lumi_password | The password the user typed at the prompt
   * @param {*} login_callback | The callback when this async function is called
   */
  function lumi_login(proj_api_v4,lumi_loginid,lumi_password,login_callback)
  {
    tableau.log("LOGIN START...")

    // create the url object
    var url = proj_api_v4 + "/user/login/";
    var params = {
      username: lumi_loginid,
      password: lumi_password
    };
    tableau.log("login url=" + url);

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data:params,
      success: function(resp_data) {
        tableau.log("login SUCCESS");
        tableau.log("login response = "+resp_data);
        login_callback(resp_data['result']['token']);
      },
      error: function(xhr, status, text) {
        tableau.log("ERROR on login: " + status);
        tableau.log("error text = " + text);
        tableau.log("full error ="+JSON.stringify(xhr));

        var response = $.parseJSON(xhr.responseText);
        if (response) tableau.log(response.error);
      },
      beforeSend: setHeader
    });

    function setHeader(xhr) {
      xhr.setRequestHeader("lumi", "lumi-cors");
    }

    function addParameterToURL(url, param, value) {
      // console.log("addparam url=" + url);
      tableau.log("encode of value for "+String(param)+" = "+String(encodeURIComponent(value)))
      url =
        url +
        (url.split("?")[1] ? "&" : "?") +
        param +
        "=" +
        encodeURIComponent(value);
      return url;
    }
    
  }
}); // document ready


