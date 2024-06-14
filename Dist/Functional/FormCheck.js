'use strict'

class FormCheck {
    constructor(form) {
        this.form = form;
        this.pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        this.errorClass = form.getAttribute("wt-formcheck-class");
        this.submitMessage = form.getAttribute("wt-formcheck-message");
        this.requiredFields = form.querySelectorAll('[wt-formcheck-type="required"]');
        this.errorElements = form.querySelectorAll('[wt-formcheck-type="error"]');
        this.submitButton = form.querySelector('[wt-formcheck-type="submit"]');
        this.defaultSubmitText = this.submitButton.textContent;
        this.resetButton = form.querySelector('[wt-formcheck-element="reset"]');
        this.requiredFieldsAndCheckboxes = form.querySelectorAll('[wt-formcheck-type="required"], [type="checkbox"]');
        this.formErrors = false;

        this.init();
    }

    init() {
        for (let element of this.errorElements) {
            element.style.display = 'none';
        }

        for (let field of this.requiredFields) {
            field.classList.remove(`${this.errorClass}`);
        }

        for (let field of this.requiredFieldsAndCheckboxes) {
            field.addEventListener('keypress', (e) => this.clearError(e));
            field.addEventListener('blur', (e) => this.clearError(e));
        }

        this.submitButton.addEventListener('click', (e) => this.validateAndSubmit(e));

        if (this.resetButton) {
            this.resetButton.addEventListener('click', (e) => this.clearForm(e));
        }
    }

    clearError(e) {
        const target = e.target;
        if (this.errorClass) target.classList.remove(`${this.errorClass}`);
        const errorElement = target.parentNode.querySelector('[wt-formcheck-type="error"]');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        this.formErrors = false;
    }

    fieldError(field) {
        const errorElement = field.parentNode.querySelector('[wt-formcheck-type="error"]');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
        field.classList.add(`${this.errorClass}`);
        this.formErrors = true;
    }

    validateAndSubmit(e) {
        this.formErrors = false;

        for (let field of this.requiredFields) {
            const fieldType = field.getAttribute('type');
            const fieldValue = field.value.trim();

            if (fieldType === 'checkbox' && !field.checked) {
                this.fieldError(field);
            } else if (fieldValue === '') {
                this.fieldError(field);
            } else if (fieldType === 'email' && (!this.isValidEmail(fieldValue))) {
                this.fieldError(field);
            } else if (fieldType === 'number' && (fieldValue === '' || isNaN(fieldValue))) {
                this.fieldError(field);
            } else if (fieldType === 'tel' && !field.value.match(this.pattern)) {
                this.fieldError(field);
            }
        }

        if (this.formErrors) {
            e.preventDefault();
        } else {
            this.submitButton.textContent = `${this.submitMessage}`;
            this.form.submit();
        }
    }

    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    clearForm(e) {
        e.preventDefault();
        for (let element of this.errorElements) {
            element.style.display = 'none';
        }

        for (let field of this.requiredFields) {
            field.classList.remove(`${this.errorClass}`);
        }

        this.form.reset();
        this.submitButton.textContent = `${this.defaultSubmitText}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('[wt-formcheck-element="form"]');
    forms.forEach(form => new FormCheck(form));
});
