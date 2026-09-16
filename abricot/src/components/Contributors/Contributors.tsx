import styles from "./Contributors.module.css";

/** Données d'un contributeur */
interface Contributor {
  /** Initiales */
  initials: string;
  /** Nom complet */
  name: string;
  /** true si propriétaire du projet */
  isOwner?: boolean;
}

/** Props de la barre des contributeurs */
interface ContributorsProps {
  /** Liste des contributeurs du projet */
  contributors: Contributor[];
}

/** Barre affichant les contributeurs du projet avec leurs rôles */
export default function Contributors({ contributors }: ContributorsProps) {
  return (
    <div className={styles.bar}>
      {/* En-tête : titre + compteur */}
      <div className={styles.header}>
        <h3 className={styles.title}>Contributeurs</h3>
        <span className={styles.count}>{contributors.length} personnes</span>
      </div>
      {/* Liste des membres avec avatars et rôles */}
      <div className={styles.members}>
        {contributors.map((c) => (
          <div key={c.initials} className={styles.member}>
            {/* Avatar (orange si propriétaire, gris sinon) */}
            <div
              className={`${styles.avatar} ${c.isOwner ? styles.avatarOwner : styles.avatarMember}`}
            >
              {c.initials}
            </div>
            {/* Tag rôle (Propriétaire ou nom complet) */}
            <span
              className={`${styles.roleTag} ${c.isOwner ? styles.roleOwner : styles.roleMember}`}
            >
              {c.isOwner ? "Propriétaire" : c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
