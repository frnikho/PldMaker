import * as path from "path";

export const ORG_ASSETS_DIR = './org/'
export const TEMPLATES_ASSETS_DIR = './templates/'
export const PLD_ASSETS_DIR = './pld/'

export const ORG_PICTURES = ['undraw_at_the_park_-2-e47.svg',
  'undraw_invite_re_rrcp.svg',
  'undraw_project_complete_lwss.svg',
  'undraw_shared_goals_re_jvqd.svg',
  'undraw_team_up_re_84ok.svg',
  'undraw_work_together_re_5yhn.svg',
  'undraw_community_re_cyrm.svg',
  'undraw_live_collaboration_re_60ha.svg',
  'undraw_projections_re_ulc6.svg',
  'undraw_stand_out_-1-oag.svg',
  'undraw_teamwork_hpdk.svg',
  'undraw_creative_team_re_85gn.svg',
  'undraw_organizing_projects_re_9p1k.svg',
  'undraw_remote_meeting_re_abe7.svg',
  'undraw_status_update_re_dm9y.svg',
  'undraw_team_work_k-80-m.svg',
  'undraw_filter_re_sa16.svg',
  'undraw_people.svg',
  'undraw_scrum_board_re_wk7v.svg',
  'undraw_team_collaboration_re_ow29.svg',
  'undraw_working_re_ddwy.svg'];

export const PLD_PICTURES = ['undraw_annotation_re_h774.svg',
  'undraw_co-working_re_w93t.svg',
  'undraw_insert_block_re_4t4l.svg',
  'undraw_operating_system_re_iqsc.svg',
  'undraw_publish_post_re_wmql.svg',
  'undraw_attached_file_re_0n9b.svg',
  'undraw_design_stats_ne2k.svg',
  'undraw_launching_re_tomg.svg',
  'undraw_organizing_projects_re_9p1k.svg',
  'undraw_reviewed_docs_re_9lmr.svg',
  'undraw_build_wireframe_re_ln7g.svg',
  'undraw_file_analysis_8k9b.svg',
  'undraw_manage_chats_re_0yoj.svg',
  'undraw_percentages_re_a1ao.svg',
  'undraw_software_engineer_re_tnjc.svg',
  'undraw_cms_re_asu0.svg',
  'undraw_file_manager_re_ms29.svg',
  'undraw_my_documents_re_13dc.svg',
  'undraw_personal_documents_re_vcf2.svg',
  'undraw_starry_window_re_0v82.svg',
  'undraw_collecting_re_lp6p.svg',
  'undraw_good_team_re_hrvm.svg',
  'undraw_my_personal_files_re_3q0p.svg',
  'undraw_personal_goals_re_iow7.svg',
  'undraw_counting_stars_re_smvv.svg',
  'undraw_google_docs_re_evm3.svg',
  'undraw_online_cv_re_gn0a.svg',
  'undraw_personal_information_re_vw8a.svg'];

const TEMPLATES_PICTURES = [
  'undraw_before_dawn_re_hp4m.svg',
  'undraw_blank_canvas_re_2hwy.svg',
  'undraw_creative_draft_vb5x.svg',
  'undraw_designer_girl_re_h54c.svg',
  'undraw_designer_mindset_re_2w1k.svg',
  'undraw_designer_re_5v95.svg',
  'undraw_everyday_design_gy64.svg',
  'undraw_factory_dy-0-a.svg',
  'undraw_innovative_re_rr5i.svg',
  'undraw_interaction_design_odgc.svg',
  'undraw_learning_sketching_nd4f.svg',
  'undraw_online_art_re_f1pk.svg',
  'undraw_sculpting_-1-c9p.svg',
  'undraw_winter_designer_a-2-m7.svg'
];

export const getTemplatePicture = (index?: number) => {
  return path.join(TEMPLATES_ASSETS_DIR, TEMPLATES_PICTURES[index ?? Math.floor(Math.random() * TEMPLATES_PICTURES.length)]);
}

export const getOrgPicture = (index?: number) => {
  return path.join(ORG_ASSETS_DIR, ORG_PICTURES[index ?? Math.floor(Math.random() * ORG_PICTURES.length)]);
}

export const getPldPicture = (index?: number) => {
  return path.join(PLD_ASSETS_DIR, PLD_PICTURES[index ?? Math.floor(Math.random() * PLD_PICTURES.length)]);
}
