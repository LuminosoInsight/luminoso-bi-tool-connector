## Luminoso Tableau Web Data Connector

**ALPHA** this connector is currently alpha and only useful for testing purposes. Use at own risk.
>> This readme hosted at: [https://luminosoinsight.github.io/luminoso-bi-tool-connector/](https://luminosoinsight.github.io/luminoso-bi-tool-connector/)

This web data connector is designed to create a simple interface between Tableau Desktop and Luminoso Daylight.

#### USAGE

> 1. Run Tableau Desktop
> 2. Choose Connect/To A Server...
> 3. Web Data Connector
> 4. Tableau Desktop will ask you for a URL
>
> **WARNING** : Use these URLS within Tableau Desktop. They will not work in a browser!
>
> 5. Use this url if you want to login with username and password:
>>> [https://luminosoinsight.github.io/luminoso-bi-tool-connector/luminoso.html](https://luminosoinsight.github.io/luminoso-bi-tool-connector/luminoso.html)
>
> 5. Use this url if you want to login with a token:
>>> [https://luminosoinsight.github.io/luminoso-bi-tool-connector/luminoso_token.html](https://luminosoinsight.github.io/luminoso-bi-tool-connector/luminoso_token.html)

> 6. You should see a dialog pop-up.
> Enter the url for your Luminoso Daylight project.
> Enter your token from the UI User Settings/API Tokens
> Click "Get Luminoso Schema"

> The tables from the project will show on the Tables pane.

> 7. Drage Score Drivers to the Data Pane.

> 8. Click Update Now

Note: To get around CORS issues, this connector currently uses a free/not highly available CORS proxy. This could go up or down at any point and should be replaced with something better.

Current Tables:
 - doc_table
 - score_drivers
 - subset_key_terms
 - subsets
 - concept_associations_table
 - themes_table
 - md_mapping - if non-English/special character subset names

Change History:
 - Version 0.5.2
   - Fixed issues with non-English subset names
 - Version 0.5.1
   - Improved themes table output
 - Version 0.5.0
   - Themes table
 - Version 0.4.1
   - Subset key terms performance improvement
 - Version 0.4.0
   - Concepts Associations Table
   - Subsets Table
 - Version 0.3.0
   - Subset key terms table - without odds and p_value
- Version 0.2.0
   - Added doc_table
- Version 0.1.0
   - Initial release - score_drivers table
