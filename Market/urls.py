from django.conf.urls import url
from . import views

urlpatterns = [
    
    url(r'create/firm/', views.Create_Firm, name="Create_Firm"),
    url(r'join/firm/', views.Join_Firm, name="Join Firm"),
    url(r'view/firm/', views.View_Firm, name="View_Firm"),
    url(r'leave/firm/', views.Leave_Firm, name="Leave_Firm"),
    url(r'search/stock/', views.Search_Stocks, name = "Search_Stocks"),
    url(r'accounts/profile/', views.Profile, name = "Profile"),
    url(r'api/transaction/', views.Transaction_List.as_view(), name="TransactionList"),
    url(r'api/useraccounts/', views.UserAccounts_API.as_view(), name="UserAccountsList"),
    url(r'api/user/', views.User_API.as_view(), name="UserList"),

    url(r'', views.Home, name="Home"),
]