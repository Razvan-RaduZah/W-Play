

function open_menu_dropdown() {
  document.getElementById("dropdown").classList.toggle("hidden")
}

window.addEventListener("click", e => {
  if (!e.target.matches("#user-menu-button, #user-menu-button > *")) {
    let dropdownmenu = document.getElementById("dropdown")
    if (!dropdownmenu.classList.contains("hidden")) {
      dropdownmenu.classList.add("hidden")
    }
  }
})


function getLoggedInUser() {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user)
  } else {
    return null
  }
}
function logoutUser() {
  localStorage.removeItem("user")
  location.reload()
}


function initPage() {

  let user = getLoggedInUser()

  if (!user) {
    document.location.href = "login.html"
    return
  }

  console.log("Page init", user.user)

  userName = user.user
  spanElement = document.getElementById("currentUserName")
  if (spanElement != undefined) {
    spanElement.innerText = userName
  }


  dateInHeader()
  timeFunction()
  setInterval(timeFunction, 1000);
  createDayList()
  totalyWorkHour(user)
  timeFunction()

}

let date = new Date();
initPage()


function totalyWorkHour(user) {
  let saveHour = () => {
    let shouldWork = document.getElementById("user-menu-button")

    let actualHour = shouldWork.value
    console.log(actualHour)

    let key = generateHourEntryKey(user)
    let value = {
      mustWork: actualHour
    }

    localStorage.setItem(key, JSON.stringify(value))

  }
  let currentHourEntry = loadHourEntry(user)
  let shouldWork = document.getElementById("user-menu-button")
  shouldWork.addEventListener("change", saveHour)

  if (currentHourEntry) {
    shouldWork.value = currentHourEntry.mustWork

  }

}
function generateHourEntryKey(user) {
  return user.user
}

function loadHourEntry(user) {
  let hourEntry = localStorage.getItem(generateHourEntryKey(user))
  if (hourEntry) {
    return JSON.parse(hourEntry)
  }
}


function timeFunction() {
  let d = new Date();
  document.getElementById("time").innerText =
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}


function dateInHeader() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let month = months[date.getMonth()];

  document.getElementById("month").innerHTML = month;
  document.getElementById("year").innerHTML = date.getFullYear();

}


function prevMonth() {
  document.getElementById("prev")
  date.setMonth(date.getMonth() - 1)
  dateInHeader()
  createDayList()
}

function nextMonth() {
  document.getElementById("next")
  date.setMonth(date.getMonth() + 1)
  dateInHeader()
  createDayList()
}

function dayOfWeek(year_month, day) {
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]


  let currentDay = new Date(
    year_month.getFullYear(),
    year_month.getMonth(),
    day
  )


  return dayNames[(currentDay.getDay() + 6) % 7]
}

function generateDailyWorkingHour() {
  let dailyWorkingHour = [8.0, 8.0, 8.0, 8.0, 8.0, 0, 0]

  let weekHourElement = document.getElementById("user-menu-button")
  if (weekHourElement != undefined) {
    let weekHour = weekHourElement.value
    for (let index = 0; index < 5; index++) {
      dailyWorkingHour[index] = weekHour / 5;

    }
  }
  return dailyWorkingHour
}

function dailyWorkingHour(year_month, day) {
  const dailyWorkingHour = generateDailyWorkingHour()

  let currentDay = new Date(
    year_month.getFullYear(),
    year_month.getMonth(),
    day
  )


  return dailyWorkingHour[(currentDay.getDay() + 6) % 7]
}

function generateTimeEntryKey(user, year, month, day) {
  return user.user + ":" + year + "/" + month + "/" + day + "/"
}

function loadTimeEntry(user, year, month, day) {
  let dayEntry = localStorage.getItem(generateTimeEntryKey(user, year, month, day))
  if (dayEntry) {
    return JSON.parse(dayEntry)
  }
}


function createDayList() {
  let lastDay1 = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()


  let calendarElement = document.getElementById('calendarDays')
  calendarElement.innerHTML = ""
  createTableHeader(calendarElement)

  let user = getLoggedInUser()
  let workHour1 = 0
  let sum = 0
  let firstsum = ''
  let first6Num = ''
  let first5Num = ''
  for (let index = 1; index <= lastDay1; index++) {
    workHour1 += dailyWorkingHour(date, index)
    let first6Str = String(workHour1).slice(0, 6)
    first6Num = Number(first6Str)

    let saveData = () => {

      let start = document.getElementById("start_" + index)
      let end = document.getElementById("end_" + index)
      let break1 = document.getElementById("break_" + index)
      let category = document.getElementById("category_" + index)
      let workedElement = document.getElementById("worked_" + index)

      let startTime = start.value
      let endTime = end.value
      let break1Time = break1.selectedIndex
      let categoryTime = category.selectedIndex

      let actualYear = date.getFullYear()
      let actualDayNum = index

      let workhour = calculateTime(index)
      workedElement.innerText = (workhour != undefined) ? workhour + ' ' : ''

      console.log(actualDayNum)

      console.log(actualYear)
      console.log(startTime)
      console.log(endTime)
      console.log(break1Time)
      console.log(categoryTime)

      let key = generateTimeEntryKey(user, actualYear, date.getMonth() + 1, index)
      console.log("Key: " + key);
      let value = {
        year: actualYear,
        month: date.getMonth() + 1,
        day: index,
        startTime: startTime,
        endTime: endTime,
        breakTime: break1Time,
        categoryTime: categoryTime
      }

      console.log(value)

      localStorage.setItem(key, JSON.stringify(value))

    }

    let currentTimeEntry = loadTimeEntry(user, date.getFullYear(), date.getMonth() + 1, index)

    if (currentTimeEntry) {
      console.log("TimeEntry: " + JSON.stringify(currentTimeEntry))
    }


    // Generate Day
    let dayNumElement = document.createElement('div')
    dayNumElement.classList.add('flex', 'justify-between', 'w-12', 'col-span-2', 'md:col-span-1', 'font-bold')

    let pWDElement = document.createElement('p')
    pWDElement.innerText = dayOfWeek(date, index)

    dayNumElement.appendChild(pWDElement)

    let pElement = document.createElement('p')

    pElement.innerText = index
    dayNumElement.appendChild(pElement)
    calendarElement.appendChild(dayNumElement)

    // Generate Category
    let catLabelElement = document.createElement('div')
    catLabelElement.classList.add('text-lg', 'font-bold', 'block', 'md:hidden')
    catLabelElement.innerText = 'Category'
    calendarElement.appendChild(catLabelElement)

    let categoryElement = document.createElement('div')
    let selectCat = document.createElement('select')
    selectCat.id = "category_" + index
    selectCat.addEventListener("change", saveData)
    selectCat.classList.add('hover:bg-purple-300', 'rounded-lg')

    let arr = ['', 'Work', 'Day Off', 'Holiday', 'Illnes', 'Travel']

    for (let i = 0; i < arr.length; i++) {
      let newOption = document.createElement('option')
      newOption.value = i
      newOption.innerText = arr[i]
      selectCat.appendChild(newOption)


    }
    categoryElement.appendChild(selectCat)
    if (currentTimeEntry) {
      selectCat.selectedIndex = currentTimeEntry.categoryTime
    }
    calendarElement.appendChild(categoryElement)



    // Generate start
    let startLabelElement = document.createElement('div')
    startLabelElement.classList.add('text-lg', 'font-bold', 'block', 'md:hidden')
    startLabelElement.innerText = 'Start'
    calendarElement.appendChild(startLabelElement)

    let startElement = document.createElement('div')
    let start = document.createElement("input")

    start.classList.add('hover:bg-purple-300', 'rounded-lg')
    start.type = "time"

    start.id = "start_" + index;

    let c2 = document.getElementById("category_" + index).value


    if (c2 == 0 || c2 == 2 || c2 == 3 || c2 == 4 || c2 == 5) {
      start.disabled = true
      start.classList.add('bg-slate-100')
      start.classList.add('hover:bg-red-400')

    }


    if (currentTimeEntry) {
      start.value = currentTimeEntry.startTime
    }
    start.addEventListener("change", saveData)
    startElement.appendChild(start)

    calendarElement.appendChild(startElement)

    // Generate End
    let endLabelElement = document.createElement('div')
    endLabelElement.classList.add('text-lg', 'font-bold', 'block', 'md:hidden')
    endLabelElement.innerText = 'End'
    calendarElement.appendChild(endLabelElement)

    let endElement = document.createElement('div')
    let end = document.createElement('input')
    end.id = "end_" + index
    let c1 = document.getElementById("category_" + index).value
    if (c1 == 0 || c1 == 2 || c1 == 3 || c1 == 4 || c1 == 5) {
      end.disabled = true
      end.classList.add('bg-slate-100')
      end.classList.add('hover:bg-red-400')
    }

    if (currentTimeEntry) {
      end.value = currentTimeEntry.endTime
    }

    end.addEventListener("change", saveData)
    end.classList.add('hover:bg-purple-300', 'rounded-lg')
    end.type = "time"
    endElement.appendChild(end)

    calendarElement.appendChild(endElement)

    // Generatet Break
    let breakLabelElement = document.createElement('div')
    breakLabelElement.classList.add('text-lg', 'font-bold', 'block', 'md:hidden')
    breakLabelElement.innerText = 'Break'
    calendarElement.appendChild(breakLabelElement)

    let breakElement = document.createElement('div')
    let selectBreak = document.createElement('select')
    selectBreak.id = "break_" + index;
    selectBreak.addEventListener("change", saveData)
    let c3 = document.getElementById("category_" + index).value



    selectBreak.classList.add('hover:bg-purple-300', 'rounded-lg')

    let arrBreakValue = [0, 15, 30, 45, 60, 90]

    for (let i = 0; i < arrBreakValue.length; i++) {
      let newBreak = document.createElement('option')
      newBreak.value = arrBreakValue[i]
      newBreak.innerHTML = arrBreakValue[i] > 0 ? arrBreakValue[i] + ' min' : ''
      selectBreak.appendChild(newBreak)
    }

    if (c3 == 0 || c3 == 2 || c3 == 3 || c3 == 4 || c3 == 5) {
      selectBreak.disabled = true
      selectBreak.classList.add('bg-slate-100')
      selectBreak.classList.add('hover:bg-red-400')
    }

    breakElement.appendChild(selectBreak)
    if (currentTimeEntry) {
      selectBreak.selectedIndex = currentTimeEntry.breakTime
    }

    calendarElement.appendChild(breakElement)

    //Generate Worked Hour

    let workhour = calculateTime(index)
    let workedLabelElement = document.createElement('div')
    workedLabelElement.classList.add('text-lg', 'font-bold', 'block', 'md:hidden')
    workedLabelElement.innerText = 'Worked'
    calendarElement.appendChild(workedLabelElement)

    let workedElement = document.createElement('div')
    workedElement.id = 'worked_' + index
    let c = document.getElementById("category_" + index).value
    if (c == 3 || c == 4 || c == 5) {
      workedElement.innerText = dailyWorkingHour(date, index) + ' ' + ' '
    } else {
      workedElement.innerText = (workhour != undefined) ? workhour + ' ' : ' '
    }
    calendarElement.appendChild(workedElement)

    let sum1 = workedElement.innerText
    console.log("Worked " + sum1)

    if (sum1.length > 0) {
      sum += parseFloat(sum1)
    }
    let first6sum = String(sum).slice(0, 5)
    firstsum = Number(first6sum)

    let remaining = first6Num - sum
    let first5Str = String(remaining).slice(0, 5)
    first5Num = Number(first5Str)

  }

  document.getElementById("totalWeekHour").innerText = "Totaly to work in Month : " + first6Num + " h"
  console.log("Totaly to work in Month  " + first6Num + " h")
  document.getElementById("totalMonthHour").innerText = "Totaly worked in Month : " + " " + firstsum + ' h'
  console.log('sum ' + firstsum)
  document.getElementById("diference").innerText = 'Remaining hour to work : ' + first5Num + ' h'

}
function reset() {
  document.getElementById("start_" + index).value = ""

}

function createTableHeader(divElement) {

  let dayNumElement = document.createElement('div')
  dayNumElement.classList.add('text-lg', 'font-bold', 'hidden', 'md:block')
  dayNumElement.innerText = 'Day'
  divElement.appendChild(dayNumElement)

  let categoryElement = document.createElement('div')
  categoryElement.classList.add('text-lg', 'font-bold', 'hidden', 'md:block')
  categoryElement.innerText = 'Category'
  divElement.appendChild(categoryElement)

  let startElement = document.createElement('div')
  startElement.classList.add('hover:text-purple-600', 'text-lg', 'font-bold', 'hidden', 'md:block')
  startElement.innerText = 'Start'
  divElement.appendChild(startElement)

  let endElement = document.createElement('div')
  endElement.classList.add('text-lg', 'font-bold', 'hidden', 'md:block')
  endElement.innerText = 'End'
  divElement.appendChild(endElement)

  let breakElement = document.createElement('div')
  breakElement.classList.add('text-lg', 'font-bold', 'hidden', 'md:block')
  breakElement.innerText = 'Break'
  divElement.appendChild(breakElement)



  let WorkedElement = document.createElement('div')
  WorkedElement.classList.add('text-lg', 'font-bold', 'hidden', 'md:block')
  WorkedElement.innerText = 'Worked'
  divElement.appendChild(WorkedElement)

}

function calculateTime(index) {


  let x = document.getElementById("start_" + index).value
  let y = document.getElementById("end_" + index).value
  let breakTime = document.getElementById("break_" + index).value

  console.log(x, y)
  let matcheS = x.match(/(\d{1,2}):(\d{2})/)

  if (!matcheS) {
    return
  }

  let timeS = new Date(0, 0, 0, parseInt(matcheS[1]), parseInt(matcheS[2]))

  let matcheE = y.match(/(\d{1,2}):(\d{2})/)
  if (!matcheE) {
    return
  }

  let timeE = new Date(0, 0, 0, parseInt(matcheE[1]), parseInt(matcheE[2]))

  let total = ((timeE - timeS) / 60000) - breakTime
  let totalHour = Math.round((total / 60 + Number.EPSILON) * 100) / 100

  console.log("Total Hour/ Day = " + totalHour)

  return totalHour

}
