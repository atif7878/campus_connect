from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.enums import UserTypeChoices


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name=None, password=None, username=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        """
        if not email:
            raise ValueError(_('Users must have an email address'))

        email = self.normalize_email(email)
        username = username or email.split('@')[0]

        user = self.model(
            email=email,
            username=username,
            first_name=first_name or "",
            last_name=last_name or "",
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name=None, password=None, username=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            username=username,
            **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_('Username'), max_length=30, unique=True)
    email = models.EmailField(_('Email Address'), unique=True)
    first_name = models.CharField(_('First Name'), max_length=30, blank=True)
    last_name = models.CharField(_('Last Name'), max_length=30, blank=True)
    is_active = models.BooleanField(_('Is Active'), default=True)
    is_staff = models.BooleanField(_('Is Staff'), default=False)
    date_joined = models.DateTimeField(_('Date Joined'), auto_now_add=True)
    user_type = models.CharField(max_length=255, choices=UserTypeChoices.choices, default=UserTypeChoices.STUDENT, verbose_name=_('User Type'))

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email
