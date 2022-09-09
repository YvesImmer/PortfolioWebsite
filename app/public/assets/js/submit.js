const { response } = require("express");

//geting the form by ID
const form = document.getElementById("contact_form")

const sendMail = (mail)=>{
    fetch("/send", {
        method: "post",
        body: mail,
        
     }).then((response)=>{
        return response.json();
     })
}

const formEvent = form.addEventListener("submit", (event)=>{
    event.preventDefault();

    let mail = new FormData(form);

    sendMail(mail)
})

