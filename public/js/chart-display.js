// Données de l'OMS (simplifiées - à compléter avec les vraies données)
const omsData = {
    boys: {
        0: { p3: 45.5, p50: 49.9, p97: 54.3 },
        1: { p3: 50.0, p50: 54.7, p97: 59.5 },
        2: { p3: 53.5, p50: 58.4, p97: 63.4 },
        3: { p3: 56.5, p50: 61.4, p97: 66.4 },
        // Ajoutez plus de données ici pour chaque mois
    },
    girls: {
        0: { p3: 45.0, p50: 49.1, p97: 53.4 },
        1: { p3: 49.0, p50: 53.7, p97: 58.4 },
        2: { p3: 52.5, p50: 57.1, p97: 61.7 },
        3: { p3: 55.5, p50: 60.0, p97: 64.5 },
        // Ajoutez plus de données ici pour chaque mois
    }
};

// Récupérer les mesures depuis le localStorage
function getMeasurements() {
    const measurements = localStorage.getItem('growthMeasurements');
    return measurements ? JSON.parse(measurements) : [];
}

// Afficher le graphique
function displayChart() {
    const measurements = getMeasurements();
    
    if (measurements.length === 0) {
        alert('Aucune mesure disponible. Veuillez prendre des mesures d\'abord.');
        window.location.href = 'measure.html';
        return;
    }
    
    // Trier les mesures par date
    measurements.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Préparer les données pour le graphique
    const labels = measurements.map(m => ${m.age} mois);
    const userData = measurements.map(m => m.size);
    
    // Récupérer les données OMS (exemple pour un garçon)
    const omsLabels = [];
    const omsP3 = [];
    const omsP50 = [];
    const omsP97 = [];
    
    // Générer les données OMS pour l'âge de l'enfant
    const maxAge = Math.max(...measurements.map(m => m.age));
    for (let age = 0; age <= maxAge; age++) {
        if (omsData.boys[age]) {
            omsLabels.push(${age} mois);
            omsP3.push(omsData.boys[age].p3);
            omsP50.push(omsData.boys[age].p50);
            omsP97.push(omsData.boys[age].p97);
        }
    }
    
    // Créer le graphique
    const ctx = document.getElementById('growthChart').getContext('2d');
    const growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: omsLabels,
            datasets: [
                {
                    label: 'Votre enfant',
                    data: userData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'OMS - P97',
                    data: omsP97,
                    borderColor: 'rgb(100, 100, 100)',
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'OMS - P50',
                    data: omsP50,
                    borderColor: 'rgb(150, 150, 150)',
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'OMS - P3',
                    data: omsP3,
                    borderColor: 'rgb(100, 100, 100)',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Taille (cm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Âge (mois)'
                    }
                }
            }
        }
    });
    
    // Afficher les dernières mesures
    displayMeasurementsList(measurements);
    
    // Vérifier les alertes
    checkAlerts(measurements);
}

// Afficher la liste des mesures
function displayMeasurementsList(measurements) {
    const listElement = document.getElementById('measurementList');
    listElement.innerHTML = '';
    
    measurements.forEach((measurement, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <strong>${measurement.age} mois</strong><br>
            Taille: ${measurement.size} cm<br>
            <small>${new Date(measurement.date).toLocaleDateString('fr-FR')}</small>
        `;
        listElement.appendChild(li);
    });
}

// Vérifier les alertes de croissance
function checkAlerts(measurements) {
    if (measurements.length < 2) return;
    
    const lastMeasure = measurements[measurements.length - 1];
    const prevMeasure = measurements[measurements.length - 2];
    
    // Calculer la vitesse de croissance
    const monthsDiff = lastMeasure.age - prevMeasure.age;
    const growthDiff = lastMeasure.size - prevMeasure.size;
    const growthRate = growthDiff / monthsDiff; // cm/mois
    
    const alertElement = document.getElementById('alertMessage');
    
    // Vérifier différentes conditions
    if (growthRate < 0.5) { // Croissance trop lente
        alertElement.className = 'alert alert-danger';
        alertElement.innerHTML = `
            <strong>⚠️ Alerte Croissance</strong><br>
            La croissance semble ralentir (${growthRate.toFixed(2)} cm/mois).<br>
            <strong>Conseil :</strong> Consultez un pédiatre.
        `;
    } else if (lastMeasure.size < omsData.boys[lastMeasure.age]?.p3) {
        alertElement.className = 'alert alert-warning';
        alertElement.innerHTML = `
            <strong>⚠️ Attention</strong><br>
            La taille est en dessous du 3ème percentile.<br>
            <strong>Conseil :</strong> Parlez-en à votre médecin.
        `;
    } else {
        alertElement.className = 'alert alert-success';
        alertElement.innerHTML = '✅ La croissance semble normale';
    }
    
    // Mettre à jour le résumé
    document.getElementById('currentSize').textContent = Taille actuelle : ${lastMeasure.size} cm;
    document.getElementById('age').textContent = Âge : ${lastMeasure.age} mois;
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', displayChart);