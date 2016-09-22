# hqAssignment
HQ Assignment Node JS Backend 

1. Clone this repo
2. Run npm install
3. Run npm start

### IMPORTANT !! ###
Populate currency table and orderResult table first!! Open the following URL
on your browser : http://127.0.0.1:3002/admin/populateDB

Then open URL : http://127.0.0.1:3002/


If you restarted the server, 
Make sure you  open http://127.0.0.1:3002/admin/populateDB first. 
Then open http://127.0.0.1:3002/

There is a config.json file (/config/config.json). Here you can set DB details, paypal config, braintree config.


Todo : 
- Finish paypal integration. Problem : paypal sandbox API always return "internal server error" response. I can't check and test the response object and its property.
- Write unit test(s)

Braintree :
For testing, please use credit card number and amount here : 
https://developers.braintreepayments.com/reference/general/testing/node

=)




