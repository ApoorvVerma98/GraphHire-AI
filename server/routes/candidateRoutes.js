import { Router } from 'express';
import { 
  getCandidates, 
  getCandidateById, 
  handleSearch,
  handleTeamBuilder,
  handleSkillGap
} from '../controllers/candidateController.js';

const router = Router();

router.get('/', getCandidates);
router.get('/search', handleSearch);
router.get('/:id', getCandidateById);
router.get('/:id/skill-gap', handleSkillGap);
router.post('/team-builder', handleTeamBuilder);

export default router;