const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#button-edit-inv")
    updateBtn.removeAttribute("disabled")
})