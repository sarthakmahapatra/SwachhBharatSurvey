

var surveyItem =function (phnum)
{
    this.phnum = phnum
    this.surveyDetails = new surveyDetails(phnum)
    
}

var  surveyDetails =  function(phnum)
{
    this.phnum = phnum
    this.status = 1
    this.isCompleted = false
    this.A1 = ''
    this.A2 = ''
    this.A3 = ''
    this.A4 = ''
}

var test = (function () {
    function test(phnum) {
        this.phnum = phnum;
    }
    return test;
})();

//exports.surveyItem = surveyItem
//exports.surveyDetails = surveyDetails