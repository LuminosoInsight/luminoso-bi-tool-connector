## Luminoso Tableau Web Data Connector

**ALPHA** this connector is currently alpha and only useful for testing purposes. Use at own risk.
>> This readme hosted at: https://luminosoinsight.github.io/luminoso-tableau/

This web data connector is designed to create a simple interface between Tableau Desktop and Luminoso Daylight.

To use:

> Run Tableau Desktop
> Choose Connect/To A Server...
> Web Data Connector

> Use the url:
> https://luminosoinsight.github.io/luminoso-tableau/luminosoWDC.html

> You should see a dialog pop-up.
> Enter the url for your Luminoso Daylight project.
> Enter your token from the UI User Settings/API Tokens
> Click "Get Luminoso Schema"

> The tables from the project will show on the Tables pane.

> Drage Score Drivers to the Data Pane.

> Click Update Now

Currently the only working table is score-drivers. Others will be added shortly.

Note: To get around CORS issues, this connector currently uses a free/not highly available CORS proxy [https://cors-anywhere.herokuapp.com/]. This could go up or down at any point and should be replaced with something better.  
