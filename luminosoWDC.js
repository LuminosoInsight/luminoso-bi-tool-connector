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
        tableau.log(
          "md item = |" +
            metadata[md_schema_idx]["name"].replace(/\s+/g, "_") +
            "|"
        );
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
          id: metadata[md_schema_idx]["name"].replace(/\s+/g, "_"),
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

      // Schema for subset key terms table
      var skt_cols = [
        {
          id: "term",
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
          id: "name",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "texts",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "cluster_label",
          dataType: tableau.dataTypeEnum.string
        },        
        {
          id: "cluster_label_nolang",
          dataType: tableau.dataTypeEnum.string
        },
        {
          id: "exact_term_ids",
          dataType: tableau.dataTypeEnum.string
        }
      ]
      var themes_table = {
        id: "themes",
        alias: "Themes",
        columns: themes_cols
      };

      schemaCallback([
        docTable,
        scoreDriverTable,
        skt_table,
        subsets_table,
        top_concept_assoc_table,
        themes_table
      ]);
    }); // get_metadata callback
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

        for (var idx = 0; idx < resp_data.result.length; idx++) {
          resp_data.result[idx].name = resp_data.result[idx].name;
        }
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
   * Get project concepts
   *
   * Description.
   * Get the list of concepts for this project
   *
   * @param {string} proj_api - the Daylight url
   * @param {string} lumi_token  - the security token from the UI User settings/API tokens
   * @param {string} concept_type - "top" or "saved" (should probably just be a concept selector?)
   * @param {function} concepts_callback - call back after the data is received
   *
   */
  function get_concepts(proj_api, lumi_token, concept_type, concepts_callback) {
    // create the url object
    var url = proj_api + "/concepts/";
    console.log("metadata url=" + url);
    console.log("lumi_token=" + lumi_token);

    // create the params for the get concepts call
    var params = {
      concept_selector: JSON.stringify({ type: concept_type })
    };
    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("get concepts SUCCESS");

        console.log("concept0=" + JSON.stringify(resp_data.result[0]));

        concepts_callback(resp_data.result);
      },
      error: function(xhr, status, text) {
        console.log("ERROR getting concepts: " + status);
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
   * Get project themes
   *
   * Description.
   * Get the list of themes for this project
   *
   * @param {string} proj_api - the Daylight url
   * @param {string} lumi_token  - the security token from the UI User settings/API tokens
   * @param {function} concepts_callback - call back after the data is received
   *
   */
  function get_themes(proj_api, lumi_token, concept_type, concepts_callback) {
    // create the url object
    var url = proj_api + "/concepts/";
    console.log("metadata url=" + url);
    console.log("lumi_token=" + lumi_token);

    // create the params for the get themes call
    var params = {
      concept_selector: JSON.stringify({ type: "suggested", 'num_clusters': 7, 'num_cluster_concepts': 7 })
    };
    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("get themes SUCCESS");

        console.log("themes0=" + JSON.stringify(resp_data.result[0]));

        concepts_callback(resp_data.result);
      },
      error: function(xhr, status, text) {
        console.log("ERROR getting themes: " + status);
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
   * Get project concept associations
   *
   * Description.
   * Get the concept associations for this project (top or saved)
   *
   * @param {string} proj_api - the Daylight url
   * @param {string} lumi_token  - the security token from the UI User settings/API tokens
   * @param {string} concept_type - "top" or "saved" (should probably just be a concept selector?)
   * @param {function} concepts_callback - call back after the data is received
   *
   */
  function get_concept_associations(
    proj_api,
    lumi_token,
    concept_type,
    concepts_callback
  ) {
    // create the url object
    var url = proj_api + "/concepts/concept_associations";
    console.log("metadata url=" + url);
    console.log("lumi_token=" + lumi_token);

    // create the params for the get concepts call
    var params = {
      concept_selector: JSON.stringify({ type: concept_type, limit: 25 })
    };
    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("concept assoc=" + JSON.stringify(resp_data));

        concepts_callback(resp_data);
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
   * @param {string} lumi_token - the Daylight security token
   * @param {string} pass_through_data - data to be passed to the callback
   * @param {list} [concept_list] - the list of concepts - comes directly from score driver output
   * @param {function} doc_callback - the callback after the docs have been received
   *
   */
  function get_three_docs(
    proj_api,
    lumi_token,
    pass_through_data,
    concept_list,
    doc_callback
  ) {
    console.log("GET THREE DOCS CONCEPTS = " + JSON.stringify(concept_list));
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
        //doc_callback(idx, sd_data, md_idx, metadata, resp_data.result);
        doc_callback(pass_through_data, resp_data.result);
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
   * Get project match counts
   *
   * Description.
   * Get the concept match counts
   *
   * @param {string} proj_api - the Daylight url
   * @param {string} lumi_token  - the security token from the UI User settings/API tokens
   * @param {function} mc_callback - call back after the data is received
   *
   */
  function get_match_counts(
    proj_api,
    lumi_token,
    ss_index,
    ss_name,
    ss_value,
    mc_callback
  ) {
    // create the url object
    var url = proj_api + "/concepts/match_counts";

    console.log("metadata url=" + url);
    console.log("lumi_token=" + lumi_token);

    // create the params for the match_counts call
    var params = {
      filter: JSON.stringify([{ name: ss_name, values: [ss_value] }]),
      concept_selector: JSON.stringify({ type: "top", limit: 25 })
    };
    Object.keys(params).forEach(function(key) {
      url = addParameterToURL(url.toString(), key, params[key]);
    });

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(resp_data) {
        console.log("match_counts SUCCESS");
        console.log("mc= " + JSON.stringify(resp_data));
        mc_callback(ss_index, ss_name, ss_value, resp_data);
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
              console.log("gsd Callback from got_score_drivers");
              //console.log("sd_data0="+JSON.stringify(sd_data[0]));

              for (var idx = 0; idx < sd_data.length; idx++) {
                // make a pt_data (pass_through) data object for each iteration
                var pt_data = {
                  md_idx: md_idx,
                  metadata: metadata,
                  sd_data: sd_data,
                  idx: idx
                };

                // do a second fetch for some sample docs
                get_three_docs(
                  project_url,
                  lumi_token,
                  pt_data,
                  sd_data[idx].texts,
                  function(pt_data, doc_data) {
                    // console.log("3ds callback from get_three_docs");
                    // console.log("pt_data idx="+pt_data.idx);
                    console.log("sd_data name = "+pt_data.sd_data[pt_data.idx].name)
                    //if (pt_data.idx < 2) {
                    //  console.log("doc=" + JSON.stringify(doc_data[0]));
                    //}

                    tableData.push({
                      score_driver_name: pt_data.sd_data[pt_data.idx].name,
                      score_field: pt_data.metadata[pt_data.md_idx].name,
                      exact_matches:
                        pt_data.sd_data[pt_data.idx].exact_match_count,
                      conceptual_matches:
                        pt_data.sd_data[pt_data.idx].match_count -
                        pt_data.sd_data[pt_data.idx].exact_match_count,
                      total_matches: pt_data.sd_data[pt_data.idx].match_count,
                      impact: pt_data.sd_data[pt_data.idx].impact,
                      confidence: pt_data.sd_data[pt_data.idx].confidence,
                      relevance: pt_data.sd_data[pt_data.idx].relevance,
                      importance: pt_data.sd_data[pt_data.idx].importance,
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
                    if (rows_complete >= pt_data.sd_data.length) {
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
              // remember, tableau cannot handle metadata naems with spaces. replace with '-'
              new_row[
                doc_table[d_idx].metadata[md_idx].name.replace(/\s+/g, "_")
              ] = doc_table[d_idx].metadata[md_idx].value;
            }
          }

          tableData.push(new_row);
        }
        table.appendRows(tableData);
        doneCallback();
      }); // get docs callback
    } // if docs table
    else if (table["tableInfo"]["id"] == "subset_key_terms") {
      var tableData = [];
      // first get all the metadata
      get_metadata(project_url, lumi_token, function(metadata) {
        console.log("SUCCESS - got metadata for skt");
        console.log("md[0] = " + JSON.stringify(metadata[0]));

        // first build a list of metadata name->value key pairs to iterate
        subset_terms = [];
        for (var md_idx = 0; md_idx < metadata.length; md_idx++) {
          // only use metadata subsets that have a list of values
          if (metadata[md_idx].values != undefined) {
            console.log("ss values = " + JSON.stringify(metadata[md_idx]));
            for (
              var ss_val_idx = 0;
              ss_val_idx < metadata[md_idx]["values"].length;
              ss_val_idx++
            ) {
              new_row = {
                subset_name: metadata[md_idx].name,
                type: metadata[md_idx].type,
                subset_value: metadata[md_idx]["values"][ss_val_idx]["value"],
                count: metadata[md_idx]["values"][ss_val_idx]["count"]
              };
              subset_terms.push(new_row);
            }
          }
        }

        // call get match_counts with zero index.
        // this will be called again by get_three_docs callback with the next index
        // once all the match_counts have been processed
        console.log("ss=" + JSON.stringify(subset_terms[0]));
        get_match_counts(
          project_url,
          lumi_token,
          0,
          subset_terms[0].subset_name,
          subset_terms[0].subset_value,
          process_match_counts
        );

        function process_match_counts(ss_idx, ss_name, ss_value, match_counts) {
          console.log("GOT MATCH COUNTS_" + ss_name);
          // console.log("GOT MATCH COUNTS_" + JSON.stringify(match_counts));
          match_counts = match_counts["match_counts"];
          console.log("GOT MCLEN" + match_counts.length);

          var mc_complete = 0;

          for (var mc_idx=0;mc_idx<match_counts.length;mc_idx++)
          {
            pt_data = {
              mc_idx: 0,
              subset_terms: subset_terms,
              ss_idx: ss_idx,
              mc_idx: mc_idx,
              match_counts: match_counts
            };
            // do a second fetch for some sample docs
            get_three_docs(
              project_url,
              lumi_token,
              pt_data,
              [pt_data.match_counts[pt_data.mc_idx].name],
              process_three_docs
            );
          }

          function process_three_docs(pt_data, doc_data) {
            //console.log("callback from get_three_docs");
            console.log(
              "ptd subset=" + pt_data.subset_terms[pt_data.ss_idx].subset_name
            );
            //console.log("subset_terms="+JSON.stringify(pt_data.subset_terms[pt_data.ss_idx]));
            //console.log("docs="+JSON.stringify(doc_data))
            if (doc_data.length > 0) {
              doc_0 = doc_data[0].text;
              doc_0_id = doc_data[0].doc_id;
            } else {
              doc_0 = undefined;
              doc_0_id = undefined;
            }
            if (doc_data.length > 1) {
              doc_1 = doc_data[1].text;
              doc_1_id = doc_data[1].doc_id;
            } else {
              doc_1 = undefined;
              doc_1_id = undefined;
            }
            if (doc_data.length > 2) {
              doc_2 = doc_data[2].text;
              doc_2_id = doc_data[2].doc_id;
            } else {
              doc_2 = undefined;
              doc_2_id = undefined;
            }

            new_row = {
              // remember tableau cannon handle metadata names with spaces, replace with -
              subset_name: pt_data.subset_terms[
                pt_data.ss_idx
              ].subset_name.replace(/\s+/g, "_"),
              subset_value: pt_data.subset_terms[pt_data.ss_idx].subset_value,
              term: pt_data.match_counts[pt_data.mc_idx].name,
              exact_match:
                pt_data.match_counts[pt_data.mc_idx].exact_match_count,
              total_match: pt_data.match_counts[pt_data.mc_idx].match_count,
              conceptual_match:
                pt_data.match_counts[pt_data.mc_idx].match_count -
                match_counts[pt_data.mc_idx].exact_match_count,
              relevance: match_counts[pt_data.mc_idx].relevance,
              sample_text_0: doc_0,
              sample_text_0_id: doc_0_id,
              sample_text_1: doc_1,
              sample_text_1_id: doc_1_id,
              sample_text_2: doc_2,
              sample_text_2_id: doc_2_id
            };
            //console.log("ADDING NEW ROW = "+JSON.stringify(new_row))
            tableData.push(new_row);

            mc_complete++;
            console.log("mc_complete="+mc_complete+" of "+pt_data.match_counts.length);
            if (mc_complete >= pt_data.match_counts.length) {
              // done with that match_count, now get the next subset
              next_idx = pt_data.ss_idx += 1;
              if (next_idx < pt_data.subset_terms.length) {
                console.log(
                  "GET NEXT SUBSET=" +
                    pt_data.subset_terms[next_idx].subset_name
                );
                get_match_counts(
                  project_url,
                  lumi_token,
                  next_idx,
                  pt_data.subset_terms[next_idx].subset_name,
                  pt_data.subset_terms[next_idx].subset_value,
                  process_match_counts
                );
              } else {
                console.log("SKT DONE tdlen=" + tableData.length);
                table.appendRows(tableData);
                doneCallback();
              } // done with last subset
            }
          } // process three docs callback;
        } // process match counts callback
      });
    } // subset key terms table
    else if (table["tableInfo"]["id"] == "subsets") {
      // get all the metadata
      get_metadata(project_url, lumi_token, function(metadata) {
        console.log("SUCCESS - got metadata for subsets");
        console.log("md[0] = " + JSON.stringify(metadata[0]));
        var tableData = [];
        for (var idx = 0; idx < metadata.length; idx++) {
          if (metadata[idx].values != undefined) {
            for (var v_idx = 0; v_idx < metadata[idx].values.length; v_idx++) {
              tableData.push({
                subset_name: metadata[idx].name.replace(/\s+/g, "_"),
                value: metadata[idx].values[v_idx].value,
                count: metadata[idx].values[v_idx].count
              });
            } // for list of values
          } // if list of values
        } // for metadata list

        console.log("SUBSETS DONE tdlen=" + tableData.length);
        table.appendRows(tableData);
        doneCallback();
      }); // subsets get metadata callback
    } // subsets table
    else if (table["tableInfo"]["id"] == "top_concepts_assoc") {
      // get all the metadata
      get_concept_associations(project_url, lumi_token, "top", function(
        concept_assoc
      ) {
        console.log("SUCCESS - got assoc data");
        //console.log("concept_assoc[0] = " + JSON.stringify(concept_assoc[0]));
        console.log("num concepts=" + concept_assoc.length);
        var tableData = [];
        for (var idx = 0; idx < concept_assoc.length; idx++) {
          for (
            var a_idx = 0;
            a_idx < concept_assoc[idx].associations.length;
            a_idx++
          ) {
            tableData.push({
              concept_name: concept_assoc[idx].name,
              assoc_name: concept_assoc[idx].associations[a_idx].name,
              relevance: concept_assoc[idx].associations[a_idx].relevance,
              association_score:
                concept_assoc[idx].associations[a_idx].association_score
            }); // push
          } // for assoc idx
        } // for concepts idx
        console.log("CONCEPT ASSOCIATIONS DONE len=" + tableData.length);
        table.appendRows(tableData);
        doneCallback();
      }); // get concepts callback
    } // if top_concepts_assoc
    else if (table["tableInfo"]["id"] == "themes") {
      // get all the metadata
      get_themes(project_url, lumi_token, "top", function(
        theme_data
      ) {
        console.log("SUCCESS - got theme data");
        console.log("num concepts=" + theme_data.length);
        console.log("theme_data0 = "+JSON.stringify(theme_data[0]));
        var tableData = [];
        
        for (var idx = 0; idx < theme_data.length; idx++) {
 
            tableData.push({
              name: theme_data[idx].name,
              texts: theme_data[idx].texts,
              cluster_label: theme_data[idx].cluster_label,
              cluster_label_nolang: theme_data[idx].cluster_label.split("|")[0],
              exact_term_ids: theme_data[idx].exact_term_ids
            }); // push
        } // for concepts idx
        console.log("THEMES DONE len=" + tableData.length);
        table.appendRows(tableData);
        doneCallback();
        
      }); // get concepts callback
    } // if top_concepts_assoc
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
    // lumi_token_tmp = "0Cr7-TIYLTEsynXW1wFiHTAOsUlUFX2h";
    // lumi_url_tmp = "http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    // lumi_url_tmp =
    //  "https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2";
    // lumi_url_tmp = "https://analytics.luminoso.com/app/projects/u22n473c/prgsqc5b"
    // lumi_token_tmp = "fGpZVIxEGxtRhd6CrnWRABt9oWv3890U"
    // lumi_url_tmp =
    //  "https://analytics.luminoso.com/app/projects/j48f473w/prwx3z7n";
    // lumi_token_tmp = "WS2yW-gr-K7Arz4_jPsNUrvB9HfXE5D1";

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
    api_url = proxy_url + api_url;
    api_v4_url = proxy_url + api_v4_url;
    proj_apiv5 = proxy_url + proj_apiv5;
    proj_apiv4 = proxy_url + proj_apiv4;

    // if lumi_token isn't set, then probably came through the username way
    if (!lumi_token_tmp) {
      if (lumi_username_tmp) {
        lumi_login(api_v4_url, lumi_username_tmp, lumi_password_tmp, function(
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
  function lumi_login(
    proj_api_v4,
    lumi_loginid,
    lumi_password,
    login_callback
  ) {
    tableau.log("LOGIN START...");

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
      data: params,
      success: function(resp_data) {
        tableau.log("login SUCCESS");
        tableau.log("login response = " + resp_data);
        login_callback(resp_data["result"]["token"]);
      },
      error: function(xhr, status, text) {
        tableau.log("ERROR on login: " + status);
        tableau.log("error text = " + text);
        tableau.log("full error =" + JSON.stringify(xhr));

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
      tableau.log(
        "encode of value for " +
          String(param) +
          " = " +
          String(encodeURIComponent(value))
      );
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
