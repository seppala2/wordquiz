from wordquiz.models import WordSet
from django.forms import ModelForm
from django.forms.widgets import Textarea

class WordSetForm(ModelForm):
	class Meta:
		model = WordSet
		fields = ['wordSet']
		labels = { 'wordSet': 'Words'}
		help_texts = { 'wordSet': 'Type each pair of words into the same row and separate them by tabs. Words on the right will be the ones shown in the quiz.'}
		widgets = {
				'wordSet': Textarea(attrs={'cols': 60, 'rows': 10})
		}