class AuthForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitBtn = this.form.querySelector('.login-btn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        this.confirmPasswordInput = document.getElementById('confirm_password');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;

        this.isSignupForm = formId === 'signupForm';

        this.validators = {
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword
        };

        if (this.isSignupForm) {
            this.validators.username = FormUtils.validateUsername;
            this.validators.confirm_password = this.validateConfirmPassword.bind(this);
            this.validators.user_type = this.validateUserType.bind(this);
        }

        this.init();
    }

    init() {
        this.addEventListeners();
        FormUtils.setupFloatingLabels(this.form);
        this.addInputAnimations();
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        if (this.isSignupForm) {
            FormUtils.setupPasswordToggle(this.confirmPasswordInput, this.confirmPasswordToggle);
        }
        this.setupSocialButtons();
        FormUtils.addSharedAnimations();
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => FormUtils.clearError(fieldName));
            }
        });

        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });

        const checkbox = document.getElementById('remember');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.animateCheckbox());
        }

        const forgotLink = document.querySelector('.forgot-password');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        const signupLink = document.querySelector('.signup-link a');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => this.handleSignupLink(e));
        }

        this.setupKeyboardShortcuts();
    }

    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input:not([type="radio"])');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    setupSocialButtons() {
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
    }

    handleFocus(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.add('focused');
        }
    }

    handleBlur(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.remove('focused');
        }
    }

    animateCheckbox() {
        const checkmark = document.querySelector('.checkmark');
        if (checkmark) {
            checkmark.style.transform = 'scale(0.8)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 150);
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        FormUtils.showNotification('Password reset link would be sent to your email', 'info', this.form);
    }

    handleSignupLink(e) {
        e.preventDefault();
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        FormUtils.showNotification(`Redirecting to ${this.isSignupForm ? 'login' : 'sign up'} page...`, 'info', this.form);
    }

    handleSocialLogin(e) {
        const btn = e.currentTarget;
        const provider = btn.classList.contains('google-btn') ? 'Google' : 'GitHub';
        btn.style.transform = 'scale(0.95)';
        btn.style.opacity = '0.8';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.opacity = '1';
        }, 200);
        FormUtils.showNotification(`Connecting to ${provider}...`, 'info', this.form);
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        const isValid = this.validateForm();
        if (isValid) {
            this.form.submit(); // Submit the form to Django
        } else {
            this.shakeForm();
        }
    }

    validateForm() {
        let isValid = true;
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];

        if (!field || !validator) return true;

        const result = validator(field.value.trim(), field);
        if (result.isValid) {
            FormUtils.clearError(fieldName);
            FormUtils.showSuccess(fieldName);
        } else {
            FormUtils.showError(fieldName, result.message);
        }
        return result.isValid;
    }

    validateConfirmPassword(value, field) {
        const password = document.getElementById('password').value;
        if (!value) {
            return { isValid: false, message: 'Confirm password is required' };
        }
        if (value !== password) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        return { isValid: true };
    }

    validateUserType(value) {
        if (!value) {
            return { isValid: false, message: 'Please select a user type' };
        }
        return { isValid: true };
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }

    showSuccessMessage() {
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(-20px)';
        const elementsToHide = ['.divider', '.social-login', '.signup-link'];
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-20px)';
            }
        });
        setTimeout(() => {
            this.form.style.display = 'none';
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            this.successMessage.classList.add('show');
            setTimeout(() => {
                this.simulateRedirect();
            }, 3000);
        }, 300);
    }

    simulateRedirect() {
        setTimeout(() => {
            this.resetForm();
        }, 2000);
    }

    showLoginError(message) {
        FormUtils.showNotification(message || 'Operation failed. Please try again.', 'error', this.form);
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }

    resetForm() {
        this.successMessage.classList.remove('show');
        setTimeout(() => {
            const elementsToShow = ['.divider', '.social-login', '.signup-link'];
            this.form.style.display = 'block';
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'block';
                }
            });
            this.form.reset();
            Object.keys(this.validators).forEach(fieldName => {
                FormUtils.clearError(fieldName);
            });
            this.form.style.opacity = '1';
            this.form.style.transform = 'translateY(0)';
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
            const inputs = this.form.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('has-value');
            });
            if (this.passwordInput) {
                this.passwordInput.type = 'password';
                const eyeIcon = this.passwordToggle?.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.remove('show-password');
                }
            }
            if (this.confirmPasswordInput) {
                this.confirmPasswordInput.type = 'password';
                const eyeIcon = this.confirmPasswordToggle?.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.remove('show-password');
                }
            }
        }, 300);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest(`#${this.form.id}`)) {
                e.preventDefault();
                this.handleSubmit(e);
            }
            if (e.key === 'Escape') {
                Object.keys(this.validators).forEach(fieldName => {
                    FormUtils.clearError(fieldName);
                });
            }
        });
    }
}

FormUtils.validateUsername = function(value) {
    if (!value) {
        return { isValid: false, message: 'Username is required' };
    }
    if (value.length < 3) {
        return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    return { isValid: true };
};

document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.querySelector('.login-card');
    FormUtils.addEntranceAnimation(loginCard);
    new AuthForm(document.getElementById('loginForm') ? 'loginForm' : 'signupForm');
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName !== 'INPUT') {
            const emailInput = document.querySelector('#email');
            if (emailInput && !emailInput.value) {
                setTimeout(() => emailInput.focus(), 100);
            }
        }
    }
});