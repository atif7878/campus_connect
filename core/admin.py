from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Fields to display in the admin list view
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'user_type')

    # Fields editable in the admin detail view
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'username', 'user_type')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Fields used when creating a new user via admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'username', 'password1', 'password2', 'user_type', 'is_staff', 'is_active'),
        }),
    )

    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
