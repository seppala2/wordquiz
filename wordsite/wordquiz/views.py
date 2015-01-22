from django.shortcuts import render, redirect
from django.forms.models import modelform_factory
from django.core.urlresolvers import reverse
from django.http import JsonResponse
from wordquiz.models import WordSet
from wordquiz.forms import WordSetForm

# Create your views here.


def index(request):
	if request.method == 'GET':
		return render(request, 'index.html')

def quiz(request, id):
	if request.method == 'GET':
		return render(request, 'quiz.html', {'wordSet': WordSet.objects.get(id=id)})
		
def newQuiz(request):
	form = WordSetForm()
	if request.method == 'GET':
		return render(request, 'newQuiz.html', {'form': form})
	if request.method == 'POST' and request.is_ajax():
		form_data = WordSetForm(request.POST)
		if form_data.is_valid():
			wordSet = form_data.save()
			return JsonResponse(
							{ 'link': request.build_absolute_uri(reverse('quiz', args=(wordSet.id,))) }  
			)
		else:
			errors = form_data.errors.as_text()
			return JsonResponse(
							{ 'errors': errors }
			)
			
			
def exampleQuiz(request):
	if request.method == 'GET':
		return render(request, 'quiz.html')