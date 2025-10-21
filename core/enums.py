from django.db import models
from django.utils.translation import gettext_lazy as _


class UserTypeChoices(models.TextChoices):
    STUDENT = 'STUDENT', _('Student')
    MENTOR = 'MENTOR', _('Mentor')


class GenericStatusChoices(models.TextChoices):
    ACTIVE = 'ACTIVE', _('Active')
    INACTIVE = 'INACTIVE', _('In-Active')
