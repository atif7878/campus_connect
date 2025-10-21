from django.contrib.auth import login
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import FormView, TemplateView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from core.forms import SignupForm, LoginForm

class SignupView(FormView):
    template_name = "signup.html"
    form_class = SignupForm
    success_url = reverse_lazy("home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_signup'] = True
        return context

    def form_valid(self, form):
        user = form.save()  # This now uses our custom save method
        login(self.request, user)
        return redirect(self.get_success_url())

    def form_invalid(self, form):
        # This will help with debugging
        print("Form errors:", form.errors)
        return super().form_invalid(form)

class CustomLoginView(LoginView):
    template_name = "login.html"
    authentication_form = LoginForm
    success_url = reverse_lazy("home")

class HomeView(TemplateView):
    template_name = "home.html"

class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('login')