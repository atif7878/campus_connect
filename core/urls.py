from django.urls import path
from django.contrib.auth.views import LogoutView
from core.views import SignupView, CustomLoginView, CustomLogoutView
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from .views import HomeView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)