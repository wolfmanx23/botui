/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var watson = require('watson-developer-cloud');
var cors = require('cors');
var maintainToneHistory = false;

// The following requires are needed for logging purposes
var uuid = require('uuid');
var vcapServices = require('vcap_services');
var basicAuth = require('basic-auth-connect');

// The app owner may optionally configure a cloudand db to track user input.
// This cloudand db is not required, the app will operate without it.
// If logging is enabled the app must also enable basic auth to secure logging
// endpoints
//var cloudantCredentials = vcapServices.getCredentials('cloudantNoSQLDB');
//var cloudantUrl = null;
//if (cloudantCredentials) {
//  cloudantUrl = cloudantCredentials.url;
//}
//cloudantUrl = cloudantUrl || process.env.CLOUDANT_URL; // || '<cloudant_url>';
var logs = null;
var app = express();

// Bootstrap application settings
app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());


// Instantiate the Watson Conversation Service as per WDC 2.2.0
/*var conversation = new watson.ConversationV1({
  version_date: '2016-09-20'
});
*/
// Instantiate the Watson Tone Analyzer Service as per WDC 2.2.0
/*var toneAnalyzer = new watson.ToneAnalyzerV3({
  version_date: '2016-05-19'
});*/

// Endpoint to be called from the client side
app.post('/v1/workspaces/:workspace_id/message', function(req, res) {

  console.log(req.params);
  console.log(req.body.input)
  console.log(req.body.context);
  var texto;
  if(!req.body.input)
  { texto="";}
  else {
texto=req.body.input.text;
      }
    console.log("entrando a URL /mensaje");
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    console.log("*********************************LA SOLICITUD ES ***********************************");
    console.log("***********************************************************************************");

    var respuesta;
    var request = require("request");
    request("https://CONTROLADOR.mybluemix.net/voicebotvivienda?texto="+texto+"&contexto="+JSON.stringify((req.body.context||{})), function(error, response, body) {
        console.log("La espuesta de bot es:");
        respuesta=response;
        console.log("*************************************");
        console.log(body);
        console.log(response);
        //return response;
        //return body;
        //return  JSON.parse(response.body);
        return res.json( JSON.parse(response.body));
        //return res.json(response.body);
        //return res.json({'output': {'text': body}});
    });
});


app.get('/mensaje', function(req, res) {
    console.log("entrando a URL /mensaje");
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query.texto;
    console.log("*********************************LA SOLICITUD ES ***********************************");
    console.log(query);
    console.log(url_parts.query.contexto);
    console.log("***********************************************************************************");
    if (url_parts.query.contexto.legth>0)
      {console.log(JSON.parse(url_parts.query.contexto));
      var contexto=JSON.parse(url_parts.query.contexto);
      contexto.texto="";
      console.log(contexto);}
    //url_parts.query.contexto["texto"]="";

    //console.log(req);
    var respuesta;
    var request = require("request");
    request("https://CONTROLADOR.mybluemix.net/webbotvivienda?texto="+query+"&contexto="+JSON.stringify(contexto), function(error, response, body) {
        console.log("La espuesta de bot es:");
        console.log(body);

        respuesta=response;
        //console.log(respuesta);
        console.log("*************************************");
        console.log(body);
        //return body;
        return res.json(body);
        //return res.json({'output': {'text': body}});
    });
});
module.exports = app;
