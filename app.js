
const dateInputRef = document.querySelector("#birthdate");
const submit_button = document.querySelector("#submit_button");
const result_section = document.querySelector(".result_section");
const result_NextPaildrome = document.querySelector(".result_NextPaildrome");
const result_PerviousPaildrome = document.querySelector(".result_PerviousPaildrome");
const result_NearestPaildrome = document.querySelector(".result_NearestPaildrome");
const img_loading = document.querySelector('.img_loading')


reverseStr = (str) => {
    var listOfCharts = str.split('');
    var reverseListOfChars = listOfCharts.reverse();
    var reversedStr = reverseListOfChars.join("");
    return reversedStr;
}

isPalindrome = (str) => {
    var reverse = reverseStr(str);
    return str === reverse;
}

convertDateToString = (date) => {
    var dateStr = {
        day: " ",
        month: " ",
        year: " ",
    };

    if (date.day < 10) {
        dateStr.day = "0" + date.day;
    } else {
        dateStr.day = date.day.toString();
    }

    if (date.month < 10) {
        dateStr.month = "0" + date.month;
    } else {
        dateStr.month = date.month.toString();
    }

    dateStr.year = date.year.toString();

    return dateStr;

}

getAllDateFormats = (date) => {

    var dateStr = convertDateToString(date);

    var ddmmyyyy = dateStr.day + dateStr.month + dateStr.year;
    var mmddyyyy = dateStr.month + dateStr.day + dateStr.year;
    var yyyymmdd = dateStr.year + dateStr.month + dateStr.day;
    var ddmmyy = dateStr.day + dateStr.month + dateStr.year.slice(-2);
    var mmddyy = dateStr.month + dateStr.day + dateStr.year.slice(-2);
    var yymmdd = dateStr.year.slice(-2) + dateStr.month + dateStr.day;

    return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd]
}

checkPalindromeForAllDateFormats = (date) => {
    var listOfPalindromes = getAllDateFormats(date);

    var flag = false;
    for (var i = 0; i < listOfPalindromes.length; i++) {
        if (isPalindrome(listOfPalindromes[i])) {
            flag = true;
            break;
        }
    }
    return flag;
}

isLeapYear = (year) => {
    if (year % 400 === 0) {
        return true;
    }
    if (year % 100 === 0) {
        return false;
    }
    if (year % 4 === 0) {
        return true;
    }
    return false;
}

getPreviousDate = (date) => {
    var day = date.day - 1;
    var month = date.month;
    var year = date.year;

    daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
   
    if (month === 3 && day === 0) {
        if (isLeapYear(year)) {
                day = 29;
                month--;
        } else {
                day = 28;
                month--;
        }
    } else {
        if (day === 0) {
            month--;
            day = daysInMonth[month - 1]
        } 
    }
    if (month <= 0) {
        day = 31
        month=12
        year--;
    }
   
    return {
        day: day,
        month: month,
        year: year
    };
}


getNextDate = (date) => {
    var day = date.day + 1;
    var month = date.month;
    var year = date.year;

   
    daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2) {
        if (isLeapYear(year)) {
            if (day > 29) {
                day = 1;
                month++;
            }
        } else {
            if (day > 28) {
                day = 1;
                month++;
            }
        }

    } else {
        if (day > daysInMonth[month - 1]) {
            day = 1;
            month++;
        }
    }
    if (month > 12) {
        month = 1;
        year++;
    }
    return {
        day: day,
        month: month,
        year: year
    };
}

getNextPalindromeDate = (date) => {
    var counter = 0;
    var nextDate = getNextDate(date);
    while (1) {
        counter++;
        var isPalindrome = checkPalindromeForAllDateFormats(nextDate);
        if (isPalindrome) {
            break;
        }
        var nextDate = getNextDate(nextDate);
       
    }
    return [counter, nextDate];
}
getPreviousPalindromeDate = (date) => {
    var counterForPrevious = 0;
    var previousDate = getPreviousDate(date)
    while (1) {
        counterForPrevious++;
        var isPalindrome = checkPalindromeForAllDateFormats(previousDate);
        if (isPalindrome) {
            break;
        }
        var previousDate = getPreviousDate(previousDate)
    }
    return [counterForPrevious, previousDate];
}


clickHandler = () => {
    var birthdayStr = dateInputRef.value;

    if (birthdayStr !== " ") {
        var listOfDate = birthdayStr.split("-");

        var date = {
            day: Number(listOfDate[2]),
            month: Number(listOfDate[1]),
            year: Number(listOfDate[0])
        };

        var isPalindrome = checkPalindromeForAllDateFormats(date);
        img_loading.style.display = 'block'
        result_section.innerHTML = ''
        result_NextPaildrome.innerHTML = ''
        result_PerviousPaildrome.innerHTML = ''
        result_NearestPaildrome.innerHTML = ''

        setTimeout(() => {
            img_loading.style.display = 'none'
            if (isPalindrome) {
                result_section.innerText = "Your Birthday is Palindrome"
            } else {
                var [counter, nextDate] = getNextPalindromeDate(date);
                var [counterForPrevious, previousDate] = getPreviousPalindromeDate(date)
                
                result_section.innerText = `Your birthdate is not palindrome.`
                result_NextPaildrome.innerHTML = ` Next palindrome date is ${nextDate.day}-${nextDate.month}-${nextDate.year}. You missed it by ${counter} days.`
                result_PerviousPaildrome.innerHTML = ` Previous palindrome date is ${previousDate.day}-${previousDate.month}-${previousDate.year}. You missed it by ${counterForPrevious} days.`
                if (counter > counterForPrevious) {
                    result_NearestPaildrome.innerHTML = `Nearest palindrome date is ${previousDate.day}-${previousDate.month}-${previousDate.year}.`
                } else {
                    result_NearestPaildrome.innerHTML = `Nearest palindrome date is ${nextDate.day}-${nextDate.month}-${nextDate.year}.`
                }
               
            }
        },1500)
        

    }
}

submit_button.addEventListener("click", clickHandler);

