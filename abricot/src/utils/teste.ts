/*############# EXEMPLE DE REPONSE ##################*/
export const BotText = `{\n  \"tasks\": [
\n    {\n      \"title\": \"Tableau de bord de suivi des progrès\",\n
      \"description\": \"Tableau de bord permettant aux apprenants de consulter leur progression dans chaque cours.\",\n 
	       \"dueDate\": \"2026-10-05\"\n   
		    },\n   
			 {\n   
			    \"title\": \"Gestion des inscriptions aux cours\",\n 
				     \"description\": \"Mettre en place le parcours d’inscription des apprenants aux cours, avec consultation du catalogue.\",\n  
	      \"dueDate\": \"2026-10-12\"\n 
		     }\n
			   ]\n}`;

interface Pars {
	tasks: TaskPars[];
}
interface TaskPars {
	title: string;
	description: string;
	dueDate: string;
}

const pars = JSON.parse(BotText) as Pars;

console.log(pars);
console.log(pars.tasks[0]);
