from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from core.models import User
from core.enums import UserTypeChoices
import re

class SignupForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}),
        label='Password',
        validators=[validate_password]  # Add password validation
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}),
        label='Confirm Password'
    )
    user_type = forms.ChoiceField(
        choices=UserTypeChoices.choices,
        widget=forms.Select(attrs={'class': 'select-input'}),
        label='User Type'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'user_type']
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Username'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Email'}),
        }
        labels = {
            'username': 'Username',
            'email': 'Email Address',
        }

    def clean_username(self):
        username = self.cleaned_data.get('username')
        
        # Username validation: 3+ characters, letters, numbers, underscore only
        if len(username) < 3:
            raise ValidationError("Username must be at least 3 characters long.")
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise ValidationError("Username can only contain letters, numbers, and underscores.")
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            raise ValidationError("This username is already taken.")
        
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise ValidationError("This email is already registered.")
        
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if password:
            try:
                validate_password(password)
            except ValidationError as e:
                raise ValidationError(list(e.messages))
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password and confirm_password and password != confirm_password:
            self.add_error("confirm_password", "Passwords do not match.")
        
        return cleaned_data

    def save(self, commit=True):
        # Save the user but don't commit yet
        user = super().save(commit=False)
        
        # Set the password properly (this will hash it)
        user.set_password(self.cleaned_data["password"])
        
        # Set additional fields if needed
        user.is_active = True
        
        if commit:
            user.save()
        
        return user

class LoginForm(AuthenticationForm):
    username = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'Email'}),
        label='Email'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}),
        label='Password'
    )