const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const db = require("./database");

dotenv.config();

const app = express();
const PORT = 3000;


/* ========================================
   MIDDLEWARE
======================================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ========================================
   TEST ROUTE
======================================== */

app.get("/", (req, res) => {

    res.json({
        message: "NovaWeb Backend fonctionne 🚀"
    });

});


/* ========================================
   CONTACT FORM API - POST
======================================== */

console.log("🔥 CONTACT ROUTE LOADED");

app.post("/api/contact", (req, res) => {

    try {

        const {
            name,
            email,
            project_type,
            budget,
            message
        } = req.body;

        console.log(
            "📩 Nouvelle demande reçue :",
            req.body
        );

        // Vérification des champs obligatoires
        if (!name || !email || !message) {

            return res.status(400).json({
                success: false,
                message:
                    "Veuillez remplir les champs obligatoires."
            });

        }

        // Préparation de la requête SQL
        const stmt = db.prepare(`
            INSERT INTO contacts
            (name, email, project_type, budget, message)
            VALUES (?, ?, ?, ?, ?)
        `);

        // Enregistrement
        const result = stmt.run(
            name,
            email,
            project_type || "",
            budget || "",
            message
        );

        console.log(
            "✅ Demande enregistrée. ID :",
            result.lastInsertRowid
        );

        return res.status(201).json({
            success: true,
            message:
                "Votre demande a été envoyée avec succès.",
            id: result.lastInsertRowid
        });

    } catch (error) {

        console.error(
            "❌ Erreur serveur :",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Erreur interne du serveur."
        });

    }

});


/* ========================================
   ADMIN - GET ALL CONTACTS
======================================== */

console.log("🔥 ADMIN CONTACTS ROUTE LOADED");

app.get("/api/contacts", (req, res) => {

    try {

        const contacts = db.prepare(`
            SELECT *
            FROM contacts
            ORDER BY created_at DESC
        `).all();

        console.log(
            "📋 Contacts envoyés :",
            contacts
        );

        return res.json({
            success: true,
            contacts: contacts
        });

    } catch (error) {

        console.error(
            "❌ Erreur récupération contacts :",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Impossible de récupérer les demandes."
        });

    }
// 
});

/* ========================================
   ADMIN - DELETE CONTACT
======================================== */

app.delete("/api/contacts/:id", (req, res) => {

    try {

        const id = Number(req.params.id);

        console.log("🗑️ DELETE REQUEST RECEIVED");
        console.log("ID :", id);

        if (!id) {

            return res.status(400).json({
                success: false,
                message: "ID invalide."
            });

        }

        const result = db.prepare(`
            DELETE FROM contacts
            WHERE id = ?
        `).run(id);

        console.log(
            "Nombre de lignes supprimées :",
            result.changes
        );

        if (result.changes === 0) {

            return res.status(404).json({
                success: false,
                message: "Demande introuvable."
            });

        }

        return res.json({
            success: true,
            message: "Demande supprimée avec succès."
        });

    } catch (error) {

        console.error(
            "❌ ERREUR DELETE :",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur."
        });

    }

});
/* ========================================
   ADMIN - UPDATE CONTACT STATUS
======================================== */

app.put("/api/contacts/:id/status", (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const allowedStatuses = [
            "Nouveau",
            "En cours",
            "Terminé"
        ];

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID invalide."
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status invalide."
            });
        }

        const result = db.prepare(`
            UPDATE contacts
            SET status = ?
            WHERE id = ?
        `).run(status, id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Demande introuvable."
            });
        }

        return res.json({
            success: true,
            message: "Status modifié avec succès."
        });

    } catch (error) {
        console.error("❌ Erreur modification status :", error);

        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur."
        });
    }
});
/* ========================================
   START SERVER
======================================== */

app.listen(PORT, () => {

    console.log(
        `🚀 NovaWeb Backend running on http://localhost:${PORT}`
    );

});

