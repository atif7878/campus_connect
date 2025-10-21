// auth_script.js

// Password visibility toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.type = field.type === 'password' ? 'text' : 'password';
    }
}

// Remember me checkbox
document.addEventListener('DOMContentLoaded', function() {
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
    }

    // Password validation for signup
    const signupPassword = document.getElementById('id_password');
    if (signupPassword) {
        signupPassword.addEventListener('input', validatePassword);
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('id_confirm_password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validateConfirmPassword);
    }
});

// Validate password strength
function validatePassword() {
    const pwd = document.getElementById('id_password').value;
    const rules = {
        length: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        special: /[!@#$%^&*]/.test(pwd)
    };

    updateRuleIcon('ruleLength', rules.length);
    updateRuleIcon('ruleUppercase', rules.uppercase);
    updateRuleIcon('ruleNumber', rules.number);
    updateRuleIcon('ruleSpecial', rules.special);

    const passwordRules = document.getElementById('passwordRules');
    if (passwordRules) {
        passwordRules.classList.toggle('show', pwd.length > 0);
    }

    return Object.values(rules).every(r => r);
}

// Update rule icon
function updateRuleIcon(id, isValid) {
    const icon = document.getElementById(id);
    if (icon) {
        icon.className = 'rule-icon ' + (isValid ? 'valid' : 'pending');
        icon.textContent = isValid ? '✓' : '○';
    }
}

// Validate confirm password
function validateConfirmPassword() {
    const pwd = document.getElementById('id_password').value;
    const confirmPwd = document.getElementById('id_confirm_password').value;
    
    if (confirmPwd && pwd !== confirmPwd) {
        showError('id_confirm_password', 'Passwords do not match');
    } else if (confirmPwd) {
        showSuccess('id_confirm_password');
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Username validation
function validateUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    field.classList.remove('success');
    
    const errorEl = field.parentElement.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

// Show success state
function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorEl = field.parentElement.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}

// Real-time username validation
document.getElementById('id_username').addEventListener('input', function(e) {
    const username = e.target.value;
    const errorElement = document.getElementById('usernameError');
    
    if (username.length > 0 && username.length < 3) {
        errorElement.textContent = "Username must be at least 3 characters long.";
        errorElement.classList.add('show');
    } else if (username.length >= 3 && !/^[a-zA-Z0-9_]+$/.test(username)) {
        errorElement.textContent = "Username can only contain letters, numbers, and underscores.";
        errorElement.classList.add('show');
    } else {
        errorElement.textContent = "";
        errorElement.classList.remove('show');
    }
});

// Real-time email validation
document.getElementById('id_email').addEventListener('blur', function(e) {
    const email = e.target.value;
    const errorElement = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        errorElement.textContent = "Please enter a valid email address.";
        errorElement.classList.add('show');
    } else {
        errorElement.textContent = "";
        errorElement.classList.remove('show');
    }
});

// Form submission validation
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const emailField = document.getElementById('id_username');
            const passwordField = document.getElementById('id_password');
            let isValid = true;

            if (emailField && !validateEmail(emailField.value)) {
                showError('id_username', 'Please enter a valid email');
                e.preventDefault();
                isValid = false;
            }

            if (passwordField && passwordField.value.length < 6) {
                showError('id_password', 'Password must be at least 6 characters');
                e.preventDefault();
                isValid = false;
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const usernameField = document.getElementById('id_username');
            const emailField = document.getElementById('id_email');
            const passwordField = document.getElementById('id_password');
            const confirmPasswordField = document.getElementById('id_confirm_password');
            const userTypeField = document.getElementById('id_user_type');
            
            let isValid = true;

            if (usernameField && !validateUsername(usernameField.value)) {
                showError('id_username', 'Username must be 3+ characters (letters, numbers, underscore only)');
                isValid = false;
            }

            if (emailField && !validateEmail(emailField.value)) {
                showError('id_email', 'Please enter a valid email');
                isValid = false;
            }

            if (passwordField && !validatePassword()) {
                showError('id_password', 'Password does not meet requirements');
                isValid = false;
            }

            if (passwordField && confirmPasswordField && passwordField.value !== confirmPasswordField.value) {
                showError('id_confirm_password', 'Passwords do not match');
                isValid = false;
            }

            if (userTypeField && !userTypeField.value) {
                showError('id_user_type', 'Please select a user type');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});