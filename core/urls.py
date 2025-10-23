# core/urls.py
from django.urls import path
from django.contrib.auth.views import LogoutView
from core.views import SignupView, CustomLoginView, CustomLogoutView
from django.views.generic import TemplateView
from .views import HomeView, ProfileView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('accounts/profile/', ProfileView.as_view(), name='profile'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
]

# Static files configuration REMOVE kar dein - yeh Vercel pe issue create karti hai