"use client";

import { useState } from "react";
import styles from "./AccountForm.module.css";

/** Formulaire de modification du compte utilisateur */
export default function AccountForm() {
  /** Nom de famille */
  const [nom, setNom] = useState("Amélie");
  /** Prénom */
  const [prenom, setPrenom] = useState("Amélie");
  /** Adresse email */
  const [email, setEmail] = useState("a.dupont@mail.com");
  /** Nouveau mot de passe (vide par défaut) */
  const [password, setPassword] = useState("");

  return (
    <div className={styles.card}>
      {/* En-tête : titre + nom complet */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mon compte</h1>
        <p className={styles.subtitle}>Amélie Dupont</p>
      </div>

      {/* Formulaire de modification */}
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="nom">
            Nom
          </label>
          <input
            className={styles.input}
            id="nom"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="prenom">
            Prénom
          </label>
          <input
            className={styles.input}
            id="prenom"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Mot de passe
          </label>
          <input
            className={styles.input}
            id="password"
            type="password"
            placeholder="•••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Modifier les informations
        </button>
      </form>
    </div>
  );
}
