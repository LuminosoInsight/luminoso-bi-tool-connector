## Luminoso Tableau Web Data Connector

**ALPHA** this connector is currently alpha and only useful for testing purposes. Use at own risk.
>> This readme hosted at: [https://luminosoinsight.github.io/luminoso-tableau/](https://luminosoinsight.github.io/luminoso-tableau/)

This web data connector is designed to create a simple interface between Tableau Desktop and Luminoso Daylight.

To use:

> Run Tableau Desktop
> Choose Connect/To A Server...
> Web Data Connector
>
> Use this url if you want to login with username and password:
>>> [https://luminosoinsight.github.io/luminoso-tableau/luminosoWDC_uname.html](https://luminosoinsight.github.io/luminoso-tableau/luminosoWDC_uname.html)
>
> Use this url if you want to login with a token:
>>> [https://luminosoinsight.github.io/luminoso-tableau/luminosoWDC.html](https://luminosoinsight.github.io/luminoso-tableau/luminosoWDC.html)

> You should see a dialog pop-up.
> Enter the url for your Luminoso Daylight project.
> Enter your token from the UI User Settings/API Tokens
> Click "Get Luminoso Schema"

> The tables from the project will show on the Tables pane.

> Drage Score Drivers to the Data Pane.

> Click Update Now

Note: To get around CORS issues, this connector currently uses a free/not highly available CORS proxy. This could go up or down at any point and should be replaced with something better.

Current Tables:
 - doc_table
 - score_drivers
 - subset_key_terms

Change History:
 - Version 0.3.0
   - Subset key terms table - without odds and p_value</li></ul>
- Version 0.2.0
   - Added doc_table</li></ul>
- Version 0.1.0
   - Initial release - score_drivers table
