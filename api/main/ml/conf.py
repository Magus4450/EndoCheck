

class_bin = ['Normal', 'Pathological']
classes_multi = ['Ampulla of vater',
    'Angiectasia',
    'Blood - fresh',
    'Blood - hematin',
    'Erosion',
    'Erythema',
    'Foreign body',
    'Ileocecal valve',
    'Lymphangiectasia',
    'Normal clean mucosa',
    'Polyp',
    'Pylorus',
    'Reduced mucosal view',
    'Ulcer'
]
samples_per_class = {
    'Ampulla of vater': 7,
    'Angiectasia': 606,
    'Blood - fresh': 312,
    'Blood - hematin': 8,
    'Erosion': 354,
    'Erythema': 111,
    'Foreign body': 543,
    'Ileocecal valve': 848,
    'Lymphangiectasia': 414,
    'Normal clean mucosa': 848,
    'Polyp': 38,
    'Pylorus': 848,
    'Reduced mucosal view': 848,
    'Ulcer': 597
}
mapping = {
        'Ampulla of vater': "Normal", 
        'Angiectasia': "Pathological", 
        'Blood - fresh': "Pathological", 
        'Blood - hematin': "Pathological", 
        'Erosion': "Pathological", 
        'Erythema': "Pathological", 
        'Foreign body': "Pathological", 
        'Ileocecal valve': "Normal", 
        'Lymphangiectasia': "Pathological", 
        'Normal clean mucosa': "Normal", 
        'Polyp': "Pathological", 
        'Pylorus': "Normal", 
        'Reduced mucosal view': "Normal", 
        'Ulcer': "Pathological"
    }

mapping_cls = {
        0:"Normal", 
        1:"Pathological", 
        2:"Pathological", 
        3:"Pathological", 
        4:"Pathological", 
        5:"Pathological", 
        6:"Pathological", 
        7:"Normal", 
        8:"Pathological", 
        9:"Normal", 
        10:"Pathological", 
        11:"Normal", 
        12:"Normal", 
        13:"Pathological"
}