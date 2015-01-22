from django.conf.urls import patterns, include, url
from wordquiz import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wsdproject.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', views.index),
    url(r'^quiz/(\d+)/$', views.quiz, name="quiz"),
    url(r'^quiz/example/$', views.exampleQuiz),
	url(r'^quiz/new/$', views.newQuiz),

    
)
