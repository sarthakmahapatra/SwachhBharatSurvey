# SwachhBharatSurvey - KooKoo Social Media Challenge

Create as part of KooKoo Social Media Challenge

## What does it do?

SwachhBharatSurvey is an IVRS based survey create using KooKoo API. User can call up the IVRS number and take the survey.
Once the survey is completed, the IVRs will hang up the call automatically. As part of the survey user will be asked the following questions:
 1. Enter your six digit area pin code
 2. Rate their city in cleanliness from a scale of one to ten
 3. Do they segregate your waste at home?
 4. Do they feel Swaachh Bharat is working?

Once the survey is completed, a completion tweet will be published to Twitter, like this

    "Thank you 98XXXX3616 for taking up Swachh Bharat Survey. Take your survey now call [IVRS Number]. #SwachhBharatSurvey"

The main page has a dashboard that show all the Survey details with Number and answers.

Also,
  1. If the user hangs up before the survey is completed. The survey will continue from the same point when the user call again.
  2. Only one survey per phone number is allowed.

