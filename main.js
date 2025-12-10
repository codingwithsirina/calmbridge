document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const userRoleInput = document.getElementById('userRole');

    // Ouverture modale au clic sur une carte
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const role = card.dataset.role; // Child, Parent, Doctor
            modal.style.display = 'flex';
            modalTitle.textContent = `${role} Authentication`;
            userRoleInput.value = role; // Pré-sélection du rôle
            switchTab('login'); // Par défaut onglet Connexion
        });
    });

    // Fermeture modale
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Gestion des onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    document.querySelectorAll('.switch-tab').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });

    function switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        document.getElementById(tabName + 'Form').classList.add('active');
    }

    // ✅ Gestion du login
    document.getElementById('loginBtn').addEventListener('click', () => {
        const role = userRoleInput.value; // Child, Parent, Doctor
        let name = '';

        if (role === 'Parent') {
            const email = document.getElementById('email').value.trim();
            if (!email) return alert('Veuillez entrer votre email');
            name = email.split('@')[0];
            localStorage.setItem('parentName', name);
            window.location.href = 'overview.html';
        }

        if (role === 'Child') {
            const childName = document.getElementById('childName').value.trim();
            if (!childName) return alert('Veuillez entrer votre nom');
            localStorage.setItem('childName', childName);
            window.location.href = 'chat.html';
        }

        if (role === 'Doctor') {
            const doctorEmail = document.getElementById('doctorEmail').value.trim();
            if (!doctorEmail) return alert('Veuillez entrer votre email');
            name = doctorEmail.split('@')[0];
            localStorage.setItem('doctorName', name);
            window.location.href = 'chat-doctor.html';
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Récupérer les valeurs du formulaire
        const fullName = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

        // Vérifier mot de passe
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        // Définir le rôle (exemple simple basé sur email ou nom)
         // par défaut
        if (email.includes("doctor")) {
            role = "doctor";
        } else if (email.includes("parent")) {
            role = "parent";
        }
        else{
             role = "child";
        }

        // Stocker le rôle dans le champ caché
        document.getElementById("userRole").value = role;

        // Simuler authentification réussie
        alert(`Bienvenue ${fullName} ! Votre rôle est : ${role}`);

        // Redirection selon le rôle
        if (role === "doctor") {
            window.location.href = "docterdascbord.html";
        } else if (role === "parent") {
            window.location.href = "dachbp.html";
        } else {
            window.location.href = "dashbord.html";
        }
    });
});
