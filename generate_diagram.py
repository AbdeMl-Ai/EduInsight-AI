import erdantic as erd

# Importi l'models s7a7 mn l'fichier dyalk
from models.domain_models import (
    Admin, 
    Student, 
    Teacher, 
    Parent, 
    ClassDocument, 
    Course, 
    Exercise, 
    Submission, 
    Notification
)

# Jm3hom kamlin f list
models_list = [
    Admin, 
    Student, 
    Teacher, 
    Parent, 
    ClassDocument, 
    Course, 
    Exercise, 
    Submission, 
    Notification
]

# Rsm l'architecture
diagram = erd.create(*models_list)
diagram.draw("architecture_diagram.png")

print("architecture desine for app")