'use strict'

const InitializeFormCheck = () => {
    let pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    var checkForms = document.querySelectorAll('[wt-formcheck-element="form"]');
    if (!checkForms || checkForms.length === 0) return;
    for (var form of checkForms) {
        var errorClass = form.getAttribute("wt-formcheck-class");
        var submitMessage = form.getAttribute("wt-formcheck-message");
        var requiredFields = form.querySelectorAll('[wt-formcheck-type="required"]');
        var errorElements = form.querySelectorAll('[wt-formcheck-type="error"]');
        var submitButton = form.querySelector('[wt-formcheck-type="submit"]');
        var requiredFieldsAndCheckboxes = form.querySelectorAll('[wt-formcheck-type="required"], [type="checkbox"]');
        var formErrors = false;

        for (let element of errorElements) {
            element.style.display = 'none';
        }

        for (var field of requiredFields) {
            field.classList.remove(`${errorClass}`);
        };

        let fieldError = (field) => {
            field.parentNode.querySelector('[wt-formcheck-type="error"]').style.display = 'block';
            field.classList.add(`${errorClass}`);
            formErrors = true;
        }

        for (var field of requiredFieldsAndCheckboxes) { 
            field.addEventListener('keypress', (e) => {
                if (errorClass) e.target.classList.remove(`${errorClass}`);
                e.target.parentNode.querySelector('[wt-formcheck-type="error"]').style.display = 'none';
                formErrors = false;
            });

            field.addEventListener('blur', (e) => {
                if (errorClass) e.target.classList.remove(`${errorClass}`);
                e.target.parentNode.querySelector('[wt-formcheck-type="error"]').style.display = 'none';
                formErrors = false;
            });
        };

        submitButton.addEventListener('click', () => {
            formErrors = false;
            for (let field of requiredFields) {
                if (field.getAttribute('type') === 'checkbox' && !field.checked) {
                    fieldError(field.nextElementSibling);
                } else if (field.value.trim() === '') {
                    fieldError(field);
                } else if (field.getAttribute('type') === 'email' && (field.value.indexOf('@') === -1 || field.value.indexOf('.') === -1)) {
                    fieldError(field);
                } else if (field.getAttribute('type') === 'number' && field.value.trim() === '' && !isNaN(field.value.trim())) {
                    fieldError(field);
                } else if (field.getAttribute('type') === 'tel' && !field.value.match(pattern)) {
                    fieldError(field);
                }
            };

            if (!formErrors) {
                submitButton.textContent = `${submitMessage}`;
                form.submit();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", InitializeFormCheck);