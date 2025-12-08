
// === ÉTAPE 1 : RÉCUPÉRER LES ÉLÉMENTS ===
const canvas = document.getElementById("measureCanvas");
const ctx = canvas.getContext("2d");
/*dessiner en 2d sur canvas*/
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

// Éléments d'affichage
const sizeValueSpan = document.getElementById("sizeValue");
const resultDiv = document.getElementById("result");

// === ÉTAPE 2 : VARIABLES POUR STOCKER LES POINTS ===
let a4Points = []; // tableau pour les 4 coins de la feuille A4
let childPoints = []; // tableau pour la tête et les pieds

// === ÉTAPE 3 : CHARGER L'IMAGE SAUVEGARDÉE ===
const savedPhoto = localStorage.getItem("photo");
/*récupération de la photo */
if (savedPhoto) {
    const img = new Image();
    img.onload = function () {
        // Ajuster le canvas à la taille de l'image
        canvas.width = img.width;
        canvas.height = img.height;
        // Dessiner l'image
        ctx.drawImage(img, 0, 0);
    };
    img.src = savedPhoto;
} else {
    alert("❌ Aucune photo trouvée ! Retournez à l'accueil.");
    window.location.href = "index.html";
}

// === ÉTAPE 4 : GÉRER LES CLICS SUR L'IMAGE ===
canvas.addEventListener("click", function (e) {
    // Position du clic
    const rect = canvas.getBoundingClientRect();
    /*.getBoundingClientRect(): mesure la position de canvas sur l'écran */
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    /*
        rect.left: debut de à canvas à gauche
        rect.top: debut de canvas en haut
        e.clientX: position x sur l'écran
        e.clientY: position y sur l'écran
        e.clientX: position x sur le canvas
        e.clientY: position y sur le canvas
        */
    // Dessiner un point rouge
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    /*dessiner un cercle de centre (x,y), de rayon 5px, 
        0:commence à dessiner à 0 degré
        2 * Math.PI: termine à 360 degré*/
    ctx.fill();
    /*remplis le cercle avec la couleur choisie (rouge)*/

    // === ÉTAPE 5 : DÉTERMINER QUEL TYPE DE POINT ===
    if (a4Points.length < 4) {
        // On collecte les points A4
        a4Points.push({ x, y });
        /*ajout de pt au tableau a4Points*/
    } else if (childPoints.length < 2) {
        // On collecte les points enfant
        childPoints.push({ x, y });

        // Calculer la taille
        calculateSize();
    }
});

// === ÉTAPE 6 : ALGORITHME DE CALCUL ===
function calculateSize() {
    if (a4Points.length === 4 && childPoints.length === 2) {
        // on suppose que la feuille A4 fait 29.7cm de haut en réalité
        const a4HeightPixels = Math.abs(a4Points[0].y - a4Points[2].y);
        //hauteur de la feuille A4 en px
        const childHeightPixels = Math.abs(
            childPoints[0].y - childPoints[1].y
        );
        //hauteur de l'enfant
        // Conversion pixels → centimètres:
        const pixelsPerCm = a4HeightPixels / 29.7;
        //combien de pixel représente un centimètre
        const childHeightCm = childHeightPixels / pixelsPerCm;

        // Afficher le résultat
        sizeValueSpan.textContent = childHeightCm.toFixed(1);
        // textcontent: remplace le texte à l'intérieur
        // tofixed(): arrondi à un chiffre après la virgule
        resultDiv.style.display = "block";
        //montrer le résultat
        saveBtn.disabled = false;
        //bouton sauvgarder active
    }
}

// === ÉTAPE 7 : BOUTON RECOMMENCER ===
resetBtn.addEventListener("click", function () {
    // Réinitialiser tout
    a4Points = [];
    childPoints = [];
    resultDiv.style.display = "none";
    saveBtn.disabled = true;

    // Redessiner l'image
    const img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };
    img.src = savedPhoto;
});

// === ÉTAPE 8 : SAUVEGARDER (SIMPLIFIÉ) ===
saveBtn.addEventListener("click", function () {
    const taille = sizeValueSpan.textContent;
    const today = new Date().toLocaleDateString("fr-FR");

    // Sauvegarder dans le localStorage
    const mesures = JSON.parse(localStorage.getItem("mesures") || "[]");
    /*
         JSON.parse:transformer le texte en tableau
         localStorage.getItem('mesures'): les données sauvgardées de measure
         ||:ou
         []:tableau vide
         */
    mesures.push({
        date: today,
        taille: parseFloat(taille),
    });
    // mesures.push: ajouter au tableau
    // parseFloat: text to float
    localStorage.setItem("mesures", JSON.stringify(mesures));
    //localStorage.setItem: pour sauvgarder dans le navigateur
    //JSON.stringify(mesures): tab to text
    //localStorage ne peut stocker que du texte
    alert("✅ Mesure sauvegardée !");
});
