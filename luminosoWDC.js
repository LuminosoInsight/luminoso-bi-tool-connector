(function() {
  var luminosoConnector = tableau.makeConnector();

  luminosoConnector.getSchema = function(schemaCallback) {

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

    var docTable = {
      id: "docs",
      alias: "Documents",
      columns: doc_cols
    };

    schemaCallback([docTable, scoreDriverTable]);
  }; // getSchem
  // tableau desktop doesn't support url.searchParam.append
  function addParameterToURL(url,param,value){
    console.log("addparam url="+url)
    //console.log("encode of value for "+String(param)+" = "+String(encodeURIComponent(value)))
    url = url + (url.split('?')[1] ? '&':'?') + param+'='+encodeURIComponent(value);
    return url;
}

  function get_score_drivers(proj_api,md_idx,score_field,sd_callback)
  {

          // create the url object
          //var url = new URL(
          //  proj_apiv5+"/concepts/score_drivers/"
          //);
          var url = proj_api+"/concepts/score_drivers/";

          // create the params for the score_drivers call
          var params = {
            score_field: score_field,
            concept_selector: JSON.stringify({ type: "top", limit: 40 })
          }; 
    
          var tableData = []
    
          //Object.keys(params).forEach(key =>
          //  url.searchParams.append(key, params[key])
          //);
          //console.log("strurl="+url)
          Object.keys(params).forEach(function (key) 
            {
              //url.searchParams.append(key, params[key])
              url = addParameterToURL(url.toString(),key,params[key])
            });
          

          console.log("score_drivers url: "+url)

          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(resp_data) 
              { 
                console.log('SUCCESS');
                //console.log("resp="+JSON.stringify(resp_data));
                sd_callback(resp_data,md_idx);

              },
            error: function() { console.log('ERROR getting data'); },
            beforeSend: setHeader
          });
  
        function setHeader(xhr) {
          xhr.setRequestHeader('Authorization', "Token " + lumi_token);
        }

          /*
          fetch(url, {
            method: "GET",
            //body: ' '
            // string or object
            headers: {
              //'Content-Type': 'application/json',
              Authorization: "Token " + lumi_token  // "gVgsZAq03A6U6f3ZF9K4s2HJFFJmFFjt"
            }
          })
            .then(function(response) {
              return response.json();
              // wait for the response object
            }).then(function(myJson) {
              console.log("Got JSON?")
              //console.log(JSON.stringify(myJson));
              sd_callback(myJson);
            });
            */

  }
  function get_score_fields(proj_api,sf_callback)
  {
          // create the url object     
          var url = proj_api+"/metadata/"
          console.log("metadata url="+url)
          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(resp_data) 
              { 
                console.log('metadata SUCCESS');
                //console.log('md_result='+JSON.stringify(resp_data));
                result = resp_data.result;
                //console.log('result='+JSON.stringify(result));
                //console.log('len='+result.length);
                
                var metadata = [];
                for(var md_resp_idx=0;md_resp_idx<result.length;md_resp_idx++)
                {
                  //console.log('it x');
                  //console.log("checking name="+result[md_resp_idx]['name']+"  type="+result[md_resp_idx]['type']);
                  if ((result[md_resp_idx]['type']=='score') || (result[md_resp_idx]['type']=='number'))
                  {
                    metadata.push(result[md_resp_idx]);
                  }
                }
                //console.log('metadata='+JSON.stringify(metadata));
                sf_callback(metadata);

              },
            error: function() { console.log('ERROR getting score fields list'); },
            beforeSend: setHeader
          });
  
          function setHeader(xhr) {
            xhr.setRequestHeader('Authorization', "Token " + lumi_token);
          }

  }

  function get_three_docs(proj_api,md_idx,concept_list,idx,sd_data,doc_callback)
  {
    
          // create the url object
          //var url = new URL(
          //  proj_api+"/docs/"
          //);          
          var url = proj_api+"/docs/"

          // create the params for the docs call
          var params = {
            limit: "3",
            search: JSON.stringify({"texts": concept_list })
          };
        
          //Object.keys(params).forEach(key =>
          //  url.searchParams.append(key, params[key])
          //);
          Object.keys(params).forEach(function (key) 
          {
            //url.searchParams.append(key, params[key])
            url = addParameterToURL(url.toString(),key,params[key])
          });

          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(resp_data) 
              { 
                console.log('3docs SUCCESS');
                //console.log("resp idx="+idx+"  "+JSON.stringify(concept_list));
                doc_callback(idx,sd_data,md_idx,resp_data.result);

              },
            error: function() { console.log('ERROR getting data'); },
            beforeSend: setHeader
          });
  
          function setHeader(xhr) {
            xhr.setRequestHeader('Authorization', "Token " + lumi_token);
          }
          /*
          // console.log("three_doc url=" + String(url));
          fetch(url, {
            method: "GET",
            headers: {
              //'Content-Type': 'application/json',
              Authorization: "Token " + lumi_token // "gVgsZAq03A6U6f3ZF9K4s2HJFFJmFFjt"
            }
          })
            .then(function(response) {
              // console.log("GOT DOC RESPONSE!")
              return response.json();
              // wait for the response object
            }).then(function(myJson) {
              // console.log("Got DOC JSON?")
              // console.log(JSON.stringify(myJson['result']));
              doc_callback(sd_data,myJson['result']);
            });
          */
  }

  luminosoConnector.getData = function(table, doneCallback) {
    tableau.log("GetData");
    tableau.log("table_id=" + table["tableInfo"]["id"]);
    console.log("Starting proxy fetch");

    lumi_data = JSON.parse(tableau.connectionData);
    console.log("connect data="+lumi_data)

    project_url = lumi_data.lumi_url
    console.log("REAL URL="+project_url)

    lumi_token = lumi_data.lumi_token

    // prepend the cors proxy until this is hosted on luminoso.com
    project_url = "https://cors-anywhere.herokuapp.com/"+project_url
    
    // Test urls, these are much faster when testing!
    // project_url = "https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    lumi_token = "gVgsZAq03A6U6f3ZF9K4s2HJFFJmFFjt"
    //project_url = "http://dd4067d4.ngrok.io/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    //project_url = "http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    //project_url = "https://cors-anywhere.herokuapp.com/https://analytics.luminoso.com/app/projects/p87t862f/prk3wg56"
    //project_url = "https://cors-anywhere.herokuapp.com/https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2"
    
    // https://analytics.luminoso.com/app/projects/p87t862f/prsfdrn2
    //lumi_token = "gVgsZAq03A6U6f3ZF9K4s2HJFFJmFFjt"

    api_url = project_url.split("/app")[0]+'/api/v5'
    url_arr = project_url.split("/")
    project_id = url_arr[url_arr.length-1]
    account_id = url_arr[url_arr.length-2]
    proj_apiv5 = api_url+"/projects/"+project_id

    console.log("proj_url="+proj_apiv5)
    
    // fetch('http://localhost:8889/postman-echo.com/get?foo1=bar1&foo2=bar2'
    // http://7f65c4cd.ngrok.io
    //fetch('http://localhost:8889/analytics.luminoso.com/app/projects/p87t862f/prk3wg56'
    if (table["tableInfo"]["id"] == "score_drivers") {
/*
      var tableData = []
      tableData.push({
        score_driver_name: 'test',
        exact_matches: 100,
        conceptual_matches:
          75,
        total_matches: 25})
        table.appendRows(tableData);
        doneCallback()
*/
      get_score_fields(proj_apiv5,function(metadata){
        console.log("SUCCESS - got score fields")
        for (var md_idx=0;md_idx<metadata.length;md_idx++)
        {
          console.log("md val = "+metadata[md_idx].name)

          get_score_drivers(proj_apiv5,md_idx,metadata[md_idx]['name'],function(sd_data,md_idx){

            var tableData = []
            var rows_complete = 0
              // this is the actual data return
              // console.log("gsd Callback from got_score_drivers");
              //console.log(JSON.stringify(sd_data));
              //for (var idx = 0; idx < 2; idx++) {
              for (var idx = 0; idx < sd_data.length; idx++) {
                  // do a second fetch for some sample docs
                get_three_docs(proj_apiv5,md_idx,sd_data[idx].texts,idx,sd_data,function(idx_inner,sd_data,md_idx,doc_data){
                  
                  console.log("3ds callback from get_three_docs")
                  // console.log("3ds doc_data="+doc_data)
                  // console.log("3ds sd_data="+JSON.stringify(sd_data))
                  //console.log("md="+JSON.stringify(metadata));
                  //console.log("md_idx="+md_idx);
                  //console.log("md="+JSON.stringify(metadata[md_idx]));
                  //console.log("len sd_data="+sd_data.length);
                  //console.log("appending idx = "+idx_inner);
                  //console.log("name="+sd_data[idx_inner].name+" impact="+sd_data[idx_inner].impact);
                  tableData.push({
                    score_driver_name: sd_data[idx_inner].name,
                    score_field: metadata[md_idx].name,
                    exact_matches: sd_data[idx_inner].exact_match_count,
                    conceptual_matches:
                      sd_data[idx_inner].match_count - sd_data[idx_inner].exact_match_count,
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
                  //console.log(sd_data[idx]['name']);
                  rows_complete++
                  // console.log("rows_complete="+rows_complete)

                  if (rows_complete>=sd_data.length)
                  {
                    table.appendRows(tableData);

                    console.log("DONE. tableData="+JSON.stringify(tableData));
                    console.log("len tableData = "+tableData.length)

                    doneCallback()
                  }
                }); // get three docs

              } // for each sd result
          }); // get score drivers
        } // for each metadata score field
      }); // get meta data
      
    } // if score_drivers

  }; // getData

  tableau.registerConnector(luminosoConnector);
})(); // register connectionName

$(document).ready(function() {
  $("#submitButton").click(function() {

    var lumiDataObj = {
      lumi_url: $("#lumi-project-url")
        .val()
        .trim(),
      lumi_token: $("#lumi-token")
        .val()
        .trim()
    };

    tableau.log("lumi-url="+lumiDataObj.lumi_url)

    // DEBUG:
    lumiDataObj.lumi_token = lumiDataObj.lumi_token 
    
    tableau.connectionData = JSON.stringify(lumiDataObj);
    tableau.connectionName = "Luminoso Data xyz";
    tableau.submit();

    tableau.log("a SUBMIT PRESSED!!");


    //tableau.connectionName = "USGS Earthquake Feed";
    //tableau.submit();
  });
});
