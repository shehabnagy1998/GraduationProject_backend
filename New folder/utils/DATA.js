const uid = require("uid");

module.exports = {
  studentData: [
    {
      code: "123456790",
      email: "shehab@gmail.com",
      name: "shehab nagy",
      password: "$2b$10$WN.oQQ.PpX7dNj7HFl0qTuZG0wn5pF4TWpxi/zpBP38VuKI8DTXam",
      phone: "01064264908",
      role_id: "0",
      profile_img: "",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoZWhhYkBnbWFpbC5jb20iLCJyb2xlX2lkIjoiMCIsImlhdCI6MTU4NDgzMTY1NiwiZXhwIjoxNTkyNzE1NjU2fQ.pOPJMR-0GyXUmSeTXatCgsAwg_dmOV2rVVfkK35PCDo",
      approved: true,
      department: "computer science",
      grade_year: "4"
    }
  ],
  doctorData: [
    {
      code: "123456780",
      email: "mohamed@gmail.com",
      name: "mohamed mostafa",
      password: "$2b$10$cEf.UW01mrOIqZ1YaWzMougVqyXcZRsUY4zxRqSksjkNs2NwCZqoq",
      phone: "01064264908",
      role_id: "2",
      profile_img: "",
      approved: true,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWRAZ21haWwuY29tIiwicm9sZV9pZCI6IjIiLCJpYXQiOjE1ODQ4MzE3MDksImV4cCI6MTU5MjcxNTcwOX0.iOvefy-89ryxs9SU83nFYahqNFT4xbIzseQqJQcilTw"
    }
  ],
  assistantData: [
    {
      code: "123456770",
      email: "aya@gmail.com",
      name: "aya mostafa",
      password: "$2b$10$YbuH9nzS8W.9rKGUt0MmlezF9cGebiCxZVdeGs9J4dpbc/iZQJPhO",
      phone: "01064264908",
      role_id: "1",
      profile_img: "",
      approved: true,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5YUBnbWFpbC5jb20iLCJyb2xlX2lkIjoiMSIsImlhdCI6MTU4NDgzMTc1MiwiZXhwIjoxNTkyNzE1NzUyfQ.5haWPeADrQcrkyhPrXb9i5JfzLeRlnNisHvLqSjn1do"
    }
  ],
  adminData: [],
  institute: [{ name: "HICIT" }, { name: "IHMI" }, { name: "HIE" }],
  department: [
    { name: "Computer Science", institute: "HICIT" },
    { name: "Mangements Information Systems", institute: "HICIT" },
    { name: "Mangement And Accountant", institute: "HICIT" },
    { name: "Mechanical Engneering", institute: "HIE" },
    { name: "Electrical Engneering", institute: "HIE" }
  ],
  grade_year: [
    { name: "First Year" },
    { name: "Second Year" },
    { name: "Third Year" },
    { name: "Fourth Year" }
  ]
};
