import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
  AuthRequest,
} from "../types";
import {
  validateCreateCommentData,
  validateUpdateCommentData,
} from "../utils/validation";
import { hasProjectAccess, canModifyTasks } from "../utils/permissions";
import {
  sendSuccess,
  sendError,
  sendValidationError,
  sendServerError,
} from "../utils/response";

/**
 * Créer un nouveau commentaire sur une tâche
 * POST /projects/:id/tasks/:taskId/comments
 *
 * @swagger
 * /projects/{id}/tasks/{taskId}/comments:
 *   post:
 *     summary: Créer un nouveau commentaire sur une tâche
 *     description: Ajoute un commentaire à une tâche existante d'un projet accessible par l'utilisateur connecté
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "clm123abc456"
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *         example: "clm789def012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenu du commentaire
 *                 example: "Je m'occupe de cette tâche."
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         comment:
 *                           $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé au projet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const { taskId } = req.params;
    const { content }: CreateCommentRequest = req.body;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    // Validation des données
    const validationErrors = validateCreateCommentData({ content });
    if (validationErrors.length > 0) {
      sendValidationError(
        res,
        "Données de création de commentaire invalides",
        validationErrors
      );
      return;
    }

    // Vérifier l'accès au projet
    const hasAccess = await hasProjectAccess(authReq.user.id, projectId);
    if (!hasAccess) {
      sendError(res, "Accès refusé au projet", "FORBIDDEN", 403);
      return;
    }

    // Vérifier que la tâche existe et appartient au projet
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      sendError(res, "Tâche non trouvée", "TASK_NOT_FOUND", 404);
      return;
    }

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        authorId: authReq.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    sendSuccess(res, "Commentaire créé avec succès", { comment }, 201);
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    sendServerError(res, "Erreur lors de la création du commentaire");
  }
};

/**
 * Récupérer tous les commentaires d'une tâche
 * GET /projects/:id/tasks/:taskId/comments
 *
 * @swagger
 * /projects/{id}/tasks/{taskId}/comments:
 *   get:
 *     summary: Récupérer tous les commentaires d'une tâche
 *     description: Retourne la liste des commentaires d'une tâche, triés par date de création croissante
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "clm123abc456"
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *         example: "clm789def012"
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         comments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé au projet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tâche non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const { taskId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    // Vérifier l'accès au projet
    const hasAccess = await hasProjectAccess(authReq.user.id, projectId);
    if (!hasAccess) {
      sendError(res, "Accès refusé au projet", "FORBIDDEN", 403);
      return;
    }

    // Vérifier que la tâche existe et appartient au projet
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      sendError(res, "Tâche non trouvée", "TASK_NOT_FOUND", 404);
      return;
    }

    // Récupérer les commentaires
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    sendSuccess(res, "Commentaires récupérés avec succès", { comments });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    sendServerError(res, "Erreur lors de la récupération des commentaires");
  }
};

/**
 * Récupérer un commentaire spécifique
 * GET /projects/:id/tasks/:taskId/comments/:commentId
 *
 * @swagger
 * /projects/{id}/tasks/{taskId}/comments/{commentId}:
 *   get:
 *     summary: Récupérer un commentaire spécifique
 *     description: Retourne le détail d'un commentaire appartenant à une tâche d'un projet accessible par l'utilisateur connecté
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "clm123abc456"
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *         example: "clm789def012"
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *         example: "clm456ghi789"
 *     responses:
 *       200:
 *         description: Commentaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         comment:
 *                           $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé au projet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Commentaire non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const { taskId, commentId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    // Vérifier l'accès au projet
    const hasAccess = await hasProjectAccess(authReq.user.id, projectId);
    if (!hasAccess) {
      sendError(res, "Accès refusé au projet", "FORBIDDEN", 403);
      return;
    }

    // Récupérer le commentaire
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        task: {
          projectId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      sendError(res, "Commentaire non trouvé", "COMMENT_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Commentaire récupéré avec succès", { comment });
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire:", error);
    sendServerError(res, "Erreur lors de la récupération du commentaire");
  }
};

/**
 * Mettre à jour un commentaire
 * PUT /projects/:id/tasks/:taskId/comments/:commentId
 *
 * @swagger
 * /projects/{id}/tasks/{taskId}/comments/{commentId}:
 *   put:
 *     summary: Mettre à jour un commentaire
 *     description: Modifie le contenu d'un commentaire. Seul l'auteur du commentaire peut le modifier
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "clm123abc456"
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *         example: "clm789def012"
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *         example: "clm456ghi789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nouveau contenu du commentaire
 *                 example: "Commentaire mis à jour."
 *     responses:
 *       200:
 *         description: Commentaire mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         comment:
 *                           $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé ou utilisateur non auteur du commentaire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Commentaire non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const { taskId, commentId } = req.params;
    const { content }: UpdateCommentRequest = req.body;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    // Validation des données
    const validationErrors = validateUpdateCommentData({ content });
    if (validationErrors.length > 0) {
      sendValidationError(
        res,
        "Données de mise à jour invalides",
        validationErrors
      );
      return;
    }

    // Vérifier l'accès au projet
    const hasAccess = await hasProjectAccess(authReq.user.id, projectId);
    if (!hasAccess) {
      sendError(res, "Accès refusé au projet", "FORBIDDEN", 403);
      return;
    }

    // Vérifier que le commentaire existe et appartient à l'utilisateur
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        task: {
          projectId,
        },
      },
    });

    if (!existingComment) {
      sendError(res, "Commentaire non trouvé", "COMMENT_NOT_FOUND", 404);
      return;
    }

    // Vérifier que l'utilisateur est l'auteur du commentaire
    if (existingComment.authorId !== authReq.user.id) {
      sendError(
        res,
        "Vous ne pouvez modifier que vos propres commentaires",
        "FORBIDDEN",
        403
      );
      return;
    }

    // Mettre à jour le commentaire
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    sendSuccess(res, "Commentaire mis à jour avec succès", {
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du commentaire:", error);
    sendServerError(res, "Erreur lors de la mise à jour du commentaire");
  }
};

/**
 * Supprimer un commentaire
 * DELETE /projects/:id/tasks/:taskId/comments/:commentId
 *
 * @swagger
 * /projects/{id}/tasks/{taskId}/comments/{commentId}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     description: Supprime un commentaire. Seul son auteur ou un membre ayant les droits de modération peut le supprimer
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "clm123abc456"
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *         example: "clm789def012"
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *         example: "clm456ghi789"
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé ou utilisateur non autorisé à supprimer ce commentaire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Commentaire non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const { taskId, commentId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    // Vérifier l'accès au projet
    const hasAccess = await hasProjectAccess(authReq.user.id, projectId);
    if (!hasAccess) {
      sendError(res, "Accès refusé au projet", "FORBIDDEN", 403);
      return;
    }

    // Vérifier que le commentaire existe
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        task: {
          projectId,
        },
      },
    });

    if (!existingComment) {
      sendError(res, "Commentaire non trouvé", "COMMENT_NOT_FOUND", 404);
      return;
    }

    // Vérifier que l'utilisateur est l'auteur du commentaire ou a les permissions de modération
    const canModify = await canModifyTasks(authReq.user.id, projectId);
    if (existingComment.authorId !== authReq.user.id && !canModify) {
      sendError(
        res,
        "Vous ne pouvez supprimer que vos propres commentaires",
        "FORBIDDEN",
        403
      );
      return;
    }

    // Supprimer le commentaire
    await prisma.comment.delete({
      where: { id: commentId },
    });

    sendSuccess(res, "Commentaire supprimé avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    sendServerError(res, "Erreur lors de la suppression du commentaire");
  }
};
