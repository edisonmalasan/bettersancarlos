# Graph Report - bettersancarlos  (2026-10-15)

## Corpus Check
- Large corpus: 620 files · ~1,335,452 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2616 nodes · 5960 edges · 224 communities (124 shown, 100 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 245 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Manual editing canvas tools
- Evidence collectors and parsers
- Civic page routes and content
- Insert session recovery state
- Configure bar parameter UI
- Minified browser bundle
- Svelte injection mount flow
- Data build emitters
- Candidate promotion reviewer
- Civic records schemas
- Page chat steering
- Gateway index and deploy
- Research index and validator
- Fixture swap helpers
- Refresh run orchestration
- Research validation pipeline
- Thematic directory pages
- CMCI charts and stats
- Refresh diff reporter
- Translation file processor
- Civic data test suite
- Home search autocomplete
- Search autocomplete duplicate
- Svelte component insertion
- Inline edit copy flow
- Serwist PWA config
- Pin annotation editor
- Facebook Graph acquisition
- Manual edit pending dock
- Research frontmatter parser
- Cold start init and Gemini
- Flatten session API
- Landing hero slideshow
- Translation extract ops
- Email template layout
- SMS activation retry
- Security scan redaction
- Mini-player snapping
- Drift detection exports
- Cancellation flag handles
- Migration cleanup bundle
- Provenance removal tasks
- Wireframe mark SVGs
- Landing hero media
- Community logo symbols
- Snapshot deep comparison
- Annotation payload types
- Hydration timing checks
- CMCI period toggles
- Laboratory capture notes
- Email template copy checks
- Server mutation guards
- QR scanner tokens
- Warehouse list rules
- Parked validation scripts
- Read deletion blocking gate
- Preview path forwards
- Attendance success copy
- Session error classes
- Edit throttle warnings
- Parcel cost counters
- Transport session unit tests
- Wiki frontend tweaks
- Human handoff bundle
- Tier upgrade protocol
- Handoff doc naming
- Transport session statuses
- Handoff JSON note
- Edit throttle recheck
- Color batch protocol
- AGENTS handoff node
- Task phase tracker
- Node rewrite bundle
- Sensor sweep notes
- Edit plus frame protocol
- Color batch toggles
- Handoff channel roles
- AGENTS agent role docs
- Logger serialization cycle
- Color mode protocol
- Opacity trace protocol
- Toast opacity request
- Sidebar toggle orchestration
- Effects menu guard
- Haste data matching
- Panel speech protocol
- Tradeoff attribute rules
- Split pointer tracing
- Kit budget flash
- Autocomplete trace checks
- Session parameter rollback
- Tracker deletion checks
- Template skip zones
- Design token exports
- Drawer resize trims
- Clip path tooltip style
- Toast undo cleanup
- Portal rebuild cleanup
- Delete file helpers
- Exit mask porting
- Checkbox hover polish
- Toast timing paths
- Bug pointer editing
- Frame file shortcuts
- Toast panel tones
- Layer panel undo
- Hotspot slider traces
- Dropdown selection tabs
- Font family listener
- Cursor handling paths
- Slot selection fixes
- Card animation overlays
- Audio thumbnail strips
- Viewer camera values
- Selection copy bugs
- Winding slider polish
- Team craft docs
- Team craft protocol docs
- Design revision loop
- Component parity tests
- UI loop deltas
- Shared seed copy
- Timed multi cycle
- Seasonal rebalance rounds
- Verification artifact dumps
- Simulated check runs
- Spot verification logs
- Storage injection tests
- Crawler and branding metadata
- GSAP animation skills
- Placeholder resize scripts
- Accessibility audit tools
- Session data schema defs
- Edit pin tests
- Envelope timing tests
- Civic skill bundles
- Turnstile config tests
- Figma integration tests
- Notion integration tests
- Library migration tests
- Label override tests
- Class consistency tests
- Pond adoption tests
- Duplicate list deltas
- GSAP performance skill
- GSAP plugins skill
- GSAP ScrollTrigger skill
- GSAP utils skill
- Purposeful motion skill
- Quality audit skill
- Edit applier
- Finish reviewer
- OpenGraph banner
- Abakada footer logo
- Code of Conduct doc
- Contributing guidelines
- Reduced motion handling
- Self-hosted Lottie assets
- Static icon baseline
- Corner radius scale lock
- Transition timing lock
- Hero 3D GLB fix
- Quiz game config
- Research data config
- Site enhancements config
- Civic data pipeline config
- Hero 3D logo
- History quiz
- Research evidence
- CDRRMO Contact
- Provincial Hospital duplicate
- Run conflicts log
- LGU Departments Page
- Unparsable resolution PDF
- Review report log
- Giant mango pie record
- Accommodation resort cluster
- PhilAtlas census fixture
- Security policy doc

## God Nodes (most connected - your core abstractions)
1. `PageHeader()` - 117 edges
2. `containerClass` - 59 edges
3. `sectionClass` - 59 edges
4. `next` - 50 edges
5. `setLiveState()` - 32 edges
6. `resumeSession()` - 32 edges
7. `connectSSE()` - 31 edges
8. `showToast()` - 30 edges
9. `el()` - 29 edges
10. `initGlobalBar()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Res 287 2023 Unparsable` --conceptually_related_to--> `Province Profile Fixture`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/province-res-287-2023.pdf → scripts/data/fixtures/province-pangasinan-san-carlos-2026-09-16.html
- `Res 304 2025 Unparsable` --conceptually_related_to--> `Province Profile Fixture`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/province-res-304-2025.pdf → scripts/data/fixtures/province-pangasinan-san-carlos-2026-09-16.html
- `Hero3DLogo Design` --references--> `Hero3DLogo()`  [EXTRACTED]
  openspec/changes/archive/2026-09-10-hero-3d-logo/design.md → src/components/three/Hero3DLogo.tsx
- `Meshopt Re-optimization` --references--> `Hero3DLogo()`  [EXTRACTED]
  openspec/changes/archive/2026-09-10-hero-logo-meshopt-fix/design.md → src/components/three/Hero3DLogo.tsx
- `SearchAutocomplete` --indirect_call--> `handleClick()`  [INFERRED]
  src/components/SearchAutocomplete.tsx → .agents/skills/impeccable/scripts/live-browser.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GSAP ecosystem** — agents_skills_gsap_core_skill, agents_skills_gsap_timeline_skill, agents_skills_gsap_scrolltrigger_skill [INFERRED 0.85]
- **Civic governance** — agents_portal, readme_civictech, contributing_guidelines, code_of_conduct_community [INFERRED 0.90]
- **Adaptation chain** — agents_skills_impeccable_skill, agents_skills_impeccable_reference_adapt, agents_skills_impeccable_reference_adapt_native [INFERRED 0.80]
- **refine to polish** — bolder_refine, clarify_rewrite, colorize_palette [EXTRACTED]
- **system lifecycle** — document_designmd, extract_patterns, doctor_repair [EXTRACTED]
- **OpenSpec change lifecycle** — agents_skills_openspec_explore_skill, agents_skills_openspec_propose_skill, agents_skills_openspec_apply_change_skill, agents_skills_openspec_sync_specs_skill, agents_skills_openspec_archive_change_skill [INFERRED 0.80]
- **Impeccable finishing pipeline** — agents_skills_impeccable_reference_polish_pass, agents_skills_impeccable_reference_quieter_design, agents_skills_impeccable_reference_typeset_type, agents_skills_impeccable_reference_degraded_finreviewer [INFERRED 0.80]
- **Degraded inline roles** — agents_skills_impeccable_reference_degraded_asset_producer, agents_skills_impeccable_reference_degraded_documenter, agents_skills_impeccable_reference_degraded_finreviewer, agents_skills_impeccable_reference_degraded_editapplier [INFERRED 0.85]
- **Civic fact lifecycle flow** — docs_data_pipeline_refresh, docs_data_pipeline_canonical, openspec_specs_civic_data_pipeline_spec_pipeline [EXTRACTED 0.75]
- **Bamboo rebrand palette system** — openspec_changes_archive_2026_09_05_rebrand_color_palette_design_palette, openspec_changes_archive_2026_09_05_rebrand_color_palette_design_tokens, openspec_changes_archive_2026_09_05_rebrand_color_palette_spec_tokens [INFERRED 0.85]
- **CI verification flow** — openspec_changes_archive_2026_09_06_ci_cd_pipeline_design_workflow, openspec_changes_archive_2026_09_06_ci_cd_pipeline_spec_verify, openspec_changes_archive_2026_09_06_ci_cd_pipeline_spec_protect [INFERRED 0.85]
- **Design polish consistency contract** — openspec_changes_archive_2026_09_10_design_polish_design_tokens, openspec_changes_archive_2026_09_10_design_polish_design_gradients, openspec_changes_archive_2026_09_10_design_polish_spec_timing [INFERRED 0.80]
- **Hero logo asset pipeline evolution** — openspec_changes_archive_2026_09_10_hero_3d_logo_specs_hero_logo_spec_asset, openspec_changes_archive_2026_09_10_hero_logo_meshopt_fix_specs_hero_logo_spec_m, openspec_changes_archive_2026_09_10_hero_logo_single_asset_specs_hero_logo_spec_s, public_assets_models_san_carlos_logo_3d_glb_served [EXTRACTED 0.90]
- **Homepage hero composition flow** — openspec_changes_archive_2026_09_10_hero_3d_logo_design_hero3d, openspec_changes_archive_2026_09_10_hero_video_infobar_collapse_design_video, src_app_page_hero_section [INFERRED 0.75]
- **History quiz game change group** — openspec_changes_archive_2026_09_10_quiz_game_proposal_quizproposal, openspec_changes_archive_2026_09_10_quiz_game_design_quizdesign, openspec_changes_archive_2026_09_10_quiz_game_tasks_quiztasks [INFERRED 0.85]
- **Research data integration change group** — openspec_changes_archive_2026_09_10_research_data_integration_proposal_dataintegrationproposal, openspec_changes_archive_2026_09_10_research_data_integration_design_dataintegrationdesign, openspec_changes_archive_2026_09_10_research_data_integration_tasks_dataintegrationtasks [INFERRED 0.85]
- **Civic data pipeline change group** — openspec_changes_archive_2026_09_14_civic_data_pipeline_proposal_pipelineproposal, openspec_changes_archive_2026_09_14_civic_data_pipeline_design_pipelinedesign, openspec_changes_archive_2026_09_14_civic_data_pipeline_tasks_pipelinetasks [INFERRED 0.85]
- **he_census_totals** — demographics_city_profile, barangay_directory, barangay_turac [EXTRACTED]
- **he_research_governance** — format_research_spec, demographics_city_profile, culture_heritage_profile [EXTRACTED]
- **evacuation_plan_2017** — cdrrmo_unit, evacuation_convergence_set, vmuf_university, provincial_hospital_san_carlos, blessed_family_hospital [INFERRED]
- **election_2025_winners** — mayor_julier_resuello, vice_mayor_joseres_resuello, rep_rachel_arenas [INFERRED]
- **philhealth_2026_set** — provincial_hospital_san_carlos, vmuf_medical_center, pangasinan_doctors_hospital, blessed_family_hospital, elguira_general_hospital, christ_bearer_infirmary [INFERRED]
- **Utilities Evidence Flow** — research_utilities_26_09_cenpelco_contacts_directory, research_utilities_26_09_public_utilities_profile, research_utilities_26_09_water_district_sccwd [EXTRACTED 0.85]
- **Transparency Pipeline** — research_transparency_26_09_budget_budget, research_transparency_26_09_full_disclosure_disclosure, docs_product_ideas_backlog [EXTRACTED 0.80]
- **News Ingestion** — docs_news_curation_workflow, docs_facebook_sync_ingestion, docs_data_pipeline_pipeline [EXTRACTED 0.85]
- **Provenance enforcement flow** — openspec_changes_archive_2026_09_30_civic_directory_provenance_tasks_provenance, openspec_changes_archive_2026_09_30_civic_directory_provenance_specs_civic_data_surfacing_spec_nosrc, openspec_changes_archive_2026_09_30_civic_directory_provenance_specs_civic_fact_provenance_guard_spec_gd [EXTRACTED 0.90]
- **Token visual consistency** — openspec_specs_brand_color_palette_spec_palette, openspec_specs_visual_design_system_spec_visual, openspec_specs_civic_composition_spec_layout [INFERRED 0.85]
- **UI restraint visual cleanup bundle** — hero_band, masthead_band, radius_token, restraint_change [EXTRACTED]
- **Unsourced fee time removal bundle** — fee_claim, processing_time_claim, provenance_change, validate_provenance_script [EXTRACTED]
- **Composition surfacing guard contract** — civic_composition_spec, civic_surfacing_spec, provenance_guard_spec [EXTRACTED]
- **Emergency Safety Planning Cluster** — research_disaster_risk_26_09_disaster_preparedness_disaster_preparedness, research_disaster_risk_26_09_hazard_maps_hazard_maps, research_emergency_26_09_emergency_hotlines_emergency_hotlines [EXTRACTED 0.85]
- **Governance Directory Cluster** — research_government_26_09_city_officials_city_officials, research_government_26_09_government_directory_government_directory, research_government_26_09_lgu_structure_lgu_structure, research_official_presence_26_09_official_online_presence_online_presence [INFERRED 0.80]
- **Health Facility Verification Flow** — research_health_26_09_doh_facilities_doh_facilities, research_health_26_09_health_facilities_health_facilities, research_runs_2026_09_16_findings_run_findings [EXTRACTED 0.85]
- **Fiscal gap appropriations vs actuals vs seal** — research_transparency_26_09_blgf_budget_appropriations_series, research_transparency_26_09_budget_regular_income_series, research_transparency_26_09_full_disclosure_transparency_seal [INFERRED 0.80]
- **Utility provision CENPELCO and SCCWD** — research_utilities_26_09_cenpelco_contacts_san_carlos_main, research_utilities_26_09_public_utilities_cenpelco, research_utilities_26_09_water_district_sccwd [INFERRED 0.80]
- **Tourism festival attractions profile** — research_tourism_26_09_festivals_mango_bamboo_festival, research_tourism_26_09_tourist_attractions_st_dominic_church, scripts_data_fixtures_province_pangasinan_san_carlos_2026_09_16_profile [INFERRED 0.75]

## Communities (224 total, 100 thin omitted)

### Community 0 - "Manual editing canvas tools"
Cohesion: 0.03
Nodes (117): addManualContextText(), applyGlobalBarLabelState(), applyPlaceholderSizingStyles(), bindEditBadgeProxy(), bufferToBase64(), buildCollapsible(), buildColorModels(), buildListHtml() (+109 more)

### Community 1 - "Evidence collectors and parsers"
Cohesion: 0.05
Nodes (75): CENPELCO_COVERAGE, CENPELCO_REGISTRY_ID, CenpelcoObservations, CenpelcoOffice, collectCenpelco(), extractGallery(), parseCenpelco(), parseCenpelcoIdentity() (+67 more)

### Community 2 - "Civic page routes and content"
Cohesion: 0.08
Nodes (40): next, AccessibilityPage(), FAQPage(), Ordinance, OrdinanceFrameworkPage(), LegislativePage(), Resolution, ResolutionFrameworkPage() (+32 more)

### Community 3 - "Insert session recovery state"
Cohesion: 0.08
Nodes (69): applyPlaceholderDimensions(), applySavedSessionMeta(), checkpointPayload(), closedClipPath(), completeParameterGenerationIfReady(), completeParameterPublication(), completeSourceInjection(), connectSSE() (+61 more)

### Community 4 - "Configure bar parameter UI"
Cohesion: 0.07
Nodes (62): actionLabel(), applyConfigureBarChrome(), applyParamDefaults(), applyParamValue(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl() (+54 more)

### Community 5 - "Minified browser bundle"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 6 - "Svelte injection mount flow"
Cohesion: 0.10
Nodes (55): abortSvelteComponentInjection(), beginNewLiveConfiguration(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), cleanup(), cleanupAcceptedSession(), clearAnnotations() (+47 more)

### Community 7 - "Data build emitters"
Cohesion: 0.08
Nodes (52): aggregateFileStatus(), barangayPopulations(), buildCityProfileJson(), buildCmciJson(), buildDemographicsJson(), buildFiscalJson(), buildHealthJson(), buildNewsJson() (+44 more)

### Community 8 - "Candidate promotion reviewer"
Cohesion: 0.08
Nodes (39): civicDir(), recordsPath(), registryPath(), sourcesPath(), cadenceWindowDays(), acceptCandidateSources(), invokedDirectly, latestRunId() (+31 more)

### Community 9 - "Civic records schemas"
Cohesion: 0.10
Nodes (31): CollectorOutput, DiffInput, REGISTRY, SOURCES, EmitContext, Candidate, CivicRecord, CivicRecordHistoryEntry (+23 more)

### Community 10 - "Page chat steering"
Cohesion: 0.11
Nodes (38): agentHasWorkInFlight(), armPageChatForTyping(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer(), collapsePageChat(), expandPageChat(), finishVoiceSession() (+30 more)

### Community 11 - "Gateway index and deploy"
Cohesion: 0.10
Nodes (35): agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), cursorForInsertAxis(), designPanelCss(), detectPageTheme(), ensureAgentPollTooltip() (+27 more)

### Community 12 - "Research index and validator"
Cohesion: 0.07
Nodes (19): REQUIRED_FIELDS, validateServiceEntry(), validateServicesData(), validateServiceUrls(), resolveRelativePath(), validateFileExists(), build.sh script, REQUIRED_FIELDS (+11 more)

### Community 13 - "Fixture swap helpers"
Cohesion: 0.06
Nodes (16): cenFixtureRoot(), CENPELCO_EXPECTED_OFFICES, CENPELCO_EXPECTED_PROVIDER, CENPELCO_FIXTURE_FILE, CENPELCO_IDS, cenSeedRecords(), daysAgoIso(), PROVINCE_FIXTURE_FILE (+8 more)

### Community 14 - "Refresh run orchestration"
Cohesion: 0.14
Nodes (30): resolveCollector(), loadRegistry(), writeJsonAtomic(), runsDir(), retryDueDays(), createRun(), finishRun(), nextRunId() (+22 more)

### Community 15 - "Research validation pipeline"
Cohesion: 0.11
Nodes (34): findLocalPathHit(), findSecretHit(), getSections(), h2Titles(), isSourceId(), looksLikeSourceId(), MdTable, parseCsv() (+26 more)

### Community 16 - "Thematic directory pages"
Cohesion: 0.10
Nodes (14): AboutPage(), AgriculturePage(), ContactPage(), DisasterPreparednessPage(), AgriculturePage(), BusinessPage(), sourceBadgeCls(), TourismPage() (+6 more)

### Community 17 - "CMCI charts and stats"
Cohesion: 0.10
Nodes (30): animateCount(), barangayData, chartColors, cmciOverviewCards, CmciPillar, cmciPillars, CmciRankEntry, CmciScoreEntry (+22 more)

### Community 18 - "Refresh diff reporter"
Cohesion: 0.13
Nodes (30): DiffEntry, diffRun(), diffScope(), invokedDirectly, isStale(), latestRunDir(), main(), recordSourceIds() (+22 more)

### Community 19 - "Translation file processor"
Cohesion: 0.10
Nodes (16): find_html_files(), get_existing_translations(), get_file_prefix(), is_in_excluded_zone(), main(), normalize_key(), normalize_text(), process_file() (+8 more)

### Community 20 - "Civic data test suite"
Cohesion: 0.15
Nodes (8): sha256FileHex(), sha256Hex(), schemasDir(), loadSchema(), snapshotCivic(), PROVINCE_E2E_IDS, PSA_E2E_IDS, GRAPH_FIXTURE

### Community 21 - "Home search autocomplete"
Cohesion: 0.16
Nodes (25): addRecentSearch(), buildSearchIndex(), calculateScore(), clearRecentSearches(), createAutocomplete(), escapeHtml(), escapeRegex(), findFuzzyMatches() (+17 more)

### Community 22 - "Search autocomplete duplicate"
Cohesion: 0.16
Nodes (25): addRecentSearch(), buildSearchIndex(), calculateScore(), clearRecentSearches(), createAutocomplete(), escapeHtml(), escapeRegex(), findFuzzyMatches() (+17 more)

### Community 23 - "Svelte component insertion"
Cohesion: 0.11
Nodes (26): abandonForeignSession(), applyOriginalAttrsToSvelteAnchor(), clearMountErrorCard(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), cyclingCounterText(), cyclingShownVariant(), describeMountFailure() (+18 more)

### Community 24 - "Inline edit copy flow"
Cohesion: 0.10
Nodes (27): applyEditing(), buildLocatorForLeaf(), collectEditableTextRows(), visit(), copyEditContainerContext(), copyEditLeafContext(), discardOrphanedSession(), dismissToast() (+19 more)

### Community 25 - "Serwist PWA config"
Cohesion: 0.08
Nodes (23): nextConfig, withSerwist, name, packageManager, private, type, version, lottie-web (+15 more)

### Community 26 - "Pin annotation editor"
Cohesion: 0.13
Nodes (25): beginEditPin(), buildAnnotationsForCapture(), buildInsertPlaceholderSnapshotFromDom(), buildPickedAnchorSnapshot(), buildPinElement(), cancelEditingPin(), captureAndEmit(), clampPlaceholderSize() (+17 more)

### Community 27 - "Facebook Graph acquisition"
Cohesion: 0.13
Nodes (17): facebookRegistry(), invokedDirectly, loadEvidence(), main(), acquireEvidence(), acquireFacebookGraph(), AcquireOptions, AcquireResult (+9 more)

### Community 28 - "Manual edit pending dock"
Cohesion: 0.19
Nodes (24): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+16 more)

### Community 29 - "Research frontmatter parser"
Cohesion: 0.11
Nodes (22): RFC-4180, asNonEmptyString(), asStringList(), DEFAULT_JURISDICTION, DiscoveredFile, fail(), FRONTMATTER_KEYS, Jurisdiction (+14 more)

### Community 30 - "Cold start init and Gemini"
Cohesion: 0.09
Nodes (24): CMCI Competitive Index, Culture and Heritage, Minor Basilica of St Dominic, Binalatongan Origin, History, Demographics and Statistics, Disaster Preparedness, Hazard Maps (+16 more)

### Community 31 - "Flatten session API"
Cohesion: 0.10
Nodes (23): Civic Data Pipeline, Facebook Graph ingestion, Page access token, Local news editor tool, News feed from news.json, News Curation Workflow, Product ideas backlog, Guard delta (+15 more)

### Community 32 - "Landing hero slideshow"
Cohesion: 0.18
Nodes (22): addRecentSearch(), buildIndex(), calculateScore(), clearRecentSearches(), CURATED_POPULAR, escapeHtml(), escapeRegex(), getPopularSearches() (+14 more)

### Community 34 - "Translation extract ops"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 35 - "Email template layout"
Cohesion: 0.17
Nodes (20): repoRoot(), buildInventory(), buildSummary(), esc(), INV_END, INV_START, invokedDirectly, loadIndexDocuments() (+12 more)

### Community 36 - "SMS activation retry"
Cohesion: 0.17
Nodes (18): BADGES, NewsEditorPage(), clearForm(), collectAndValidate(), fetchFromServer(), handleCopy(), handleDelete(), handleDownload() (+10 more)

### Community 37 - "Security scan redaction"
Cohesion: 0.12
Nodes (20): averageRgb01(), captureChromeNodes(), captureElementFromRenderedAncestor(), captureElementToBlob(), compileShader(), cssColorToRgb01(), dominantRgb01(), findBackdropAncestor() (+12 more)

### Community 38 - "Mini-player snapping"
Cohesion: 0.13
Nodes (10): @base-ui/react, class-variance-authority, clsx, tailwind-merge, Header(), handleResize(), isMobileNav(), Button() (+2 more)

### Community 39 - "Drift detection exports"
Cohesion: 0.16
Nodes (18): animateBars(), animateCMCIBars(), animateCount(), barangayData, charts, cmciData, COLORS, createBarChart() (+10 more)

### Community 40 - "Cancellation flag handles"
Cohesion: 0.10
Nodes (20): scripts, build, data:diff, data:generate, data:ingest-facebook, data:promote, data:refresh, data:report (+12 more)

### Community 41 - "Migration cleanup bundle"
Cohesion: 0.16
Nodes (18): animateBars(), animateCMCIBars(), animateCount(), barangayData, charts, cmciData, COLORS, createBarChart() (+10 more)

### Community 42 - "Provenance removal tasks"
Cohesion: 0.18
Nodes (12): build_ilo_from_fil(), extract_lang_dict(), is_bad_translation(), main(), build_lang_block(), replace_lang_block(), translate_sentence_fil(), build_ilo() (+4 more)

### Community 43 - "Wireframe mark SVGs"
Cohesion: 0.16
Nodes (14): react, inter, metadata, RootLayout(), viewport, Footer(), BeforeInstallPromptEvent, PWAManager() (+6 more)

### Community 44 - "Landing hero media"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 45 - "Community logo symbols"
Cohesion: 0.16
Nodes (19): buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), cloneWithoutElements(), collectTextNodes(), collectVisibleTexts(), cssEscapeIdent(), elementMatchesOriginalMarkup() (+11 more)

### Community 46 - "Snapshot deep comparison"
Cohesion: 0.21
Nodes (15): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+7 more)

### Community 47 - "Annotation payload types"
Cohesion: 0.21
Nodes (17): attachSteerFocusDebug(), attachSteerFocusGuard(), clearSteerFocusRecoverTimer(), focusConfigureInput(), focusSteerChat(), isInlineEditActive(), isPageEditableActive(), isPageEditableElement() (+9 more)

### Community 48 - "Hydration timing checks"
Cohesion: 0.16
Nodes (11): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+3 more)

### Community 49 - "CMCI period toggles"
Cohesion: 0.21
Nodes (12): AtomicPairOptions, backupName(), commitAtomicPair(), detectTornPair(), groupByPid(), mtimeOf(), parseJsonFile(), recoverAtomicPair() (+4 more)

### Community 50 - "Laboratory capture notes"
Cohesion: 0.26
Nodes (15): attachEventListeners(), filterProjects(), formatCurrency(), formatDate(), getCategoryClass(), getCategoryCounts(), getCategoryLabel(), getStatusBadge() (+7 more)

### Community 51 - "Email template copy checks"
Cohesion: 0.25
Nodes (15): buildPluginIframe(), esc(), formatDate(), init(), probeLiveFeed(), cleanup(), fail(), onMessage() (+7 more)

### Community 52 - "Server mutation guards"
Cohesion: 0.28
Nodes (15): animateValue(), calculatePercentage(), formatPesoMillions(), init(), initCharts(), initEventListeners(), initExpenditureBars(), initScrollAnimations() (+7 more)

### Community 53 - "QR scanner tokens"
Cohesion: 0.18
Nodes (13): @lordicon/react, AnimatedIcon(), AnimatedIconProps, IconData, PlayerComponentType, PlayerInstance, HourForecast, mapAnimatedIcon() (+5 more)

### Community 54 - "Warehouse list rules"
Cohesion: 0.26
Nodes (15): attachEventListeners(), filterProjects(), formatCurrency(), formatDate(), getCategoryClass(), getCategoryCounts(), getCategoryLabel(), getStatusBadge() (+7 more)

### Community 55 - "Parked validation scripts"
Cohesion: 0.25
Nodes (15): buildPluginIframe(), esc(), formatDate(), init(), probeLiveFeed(), cleanup(), fail(), onMessage() (+7 more)

### Community 56 - "Read deletion blocking gate"
Cohesion: 0.28
Nodes (15): animateValue(), calculatePercentage(), formatPesoMillions(), init(), initCharts(), initEventListeners(), initExpenditureBars(), initScrollAnimations() (+7 more)

### Community 57 - "Preview path forwards"
Cohesion: 0.18
Nodes (13): appRoot, categoriesDir, categoryPages, categoryServices(), detailsDir, jsxString(), linkHref(), servicesJson (+5 more)

### Community 58 - "Attendance success copy"
Cohesion: 0.17
Nodes (9): EducationPage(), HealthPage(), HealthPage(), CATEGORIES, ServicesDirectoryPage(), Container(), ContainerProps, Section() (+1 more)

### Community 59 - "Session error classes"
Cohesion: 0.20
Nodes (11): Barangay, BarangayDetailPage(), barangays, displayName(), formatName(), formatPopulation(), generateStaticParams(), Position (+3 more)

### Community 60 - "Edit throttle warnings"
Cohesion: 0.26
Nodes (13): cacheWeather(), fetchWeather(), getCachedWeather(), getMockWeather(), init(), initLeaflet(), isFileProtocol(), mapWeatherCode() (+5 more)

### Community 61 - "Parcel cost counters"
Cohesion: 0.14
Nodes (5): frames, server, t0, server, VIEWPORTS

### Community 62 - "Transport session unit tests"
Cohesion: 0.26
Nodes (13): cacheWeather(), fetchWeather(), getCachedWeather(), getMockWeather(), init(), initLeaflet(), isFileProtocol(), mapWeatherCode() (+5 more)

### Community 63 - "Wiki frontend tweaks"
Cohesion: 0.14
Nodes (9): chart.js, BudgetPage(), DpwhProject, dpwhProjects, DpwhSummary, FiscalYear, fiscalYears, formatPeso() (+1 more)

### Community 64 - "Human handoff bundle"
Cohesion: 0.33
Nodes (8): CertificatesPage(), EducationPage(), PublicSafetyPage(), SocialServicesPage(), TaxPaymentsPage(), CharterPointer(), ServiceEntry(), ServiceEntryProps

### Community 65 - "Tier upgrade protocol"
Cohesion: 0.15
Nodes (4): add_quiz_to_sitemap(), fix_copyright(), fix_footer_quiz_link(), get_page_prefix()

### Community 66 - "Handoff doc naming"
Cohesion: 0.14
Nodes (14): dependencies, @base-ui/react, chart.js, class-variance-authority, gsap, @gsap/react, @lordicon/react, lottie-web (+6 more)

### Community 67 - "Transport session statuses"
Cohesion: 0.22
Nodes (12): Cadence, CivicStatus, RiskTier, RunSourceOutcome, addDays(), CADENCE_POLICY, CadenceRule, HIGH_RISK_DOMAINS (+4 more)

### Community 68 - "Handoff JSON note"
Cohesion: 0.19
Nodes (11): Source Hero GLB, GLB Regression Fix, Hero3DLogo Design, Meshopt Re-optimization, InfoBar Design, Video Hero Design, Served Hero GLB, three (+3 more)

### Community 69 - "Edit throttle recheck"
Cohesion: 0.23
Nodes (12): barangayData, CHART_COLORS, chartInstances, createDistributionPieChart(), createHistoricalLineChart(), createPopulationBarChart(), economicData, getChartColors() (+4 more)

### Community 70 - "Color batch protocol"
Cohesion: 0.15
Nodes (13): devDependencies, clsx, postcss, serwist, @serwist/next, tailwind-merge, tailwindcss, @tailwindcss/postcss (+5 more)

### Community 71 - "AGENTS handoff node"
Cohesion: 0.23
Nodes (12): barangayData, CHART_COLORS, chartInstances, createDistributionPieChart(), createHistoricalLineChart(), createPopulationBarChart(), economicData, getChartColors() (+4 more)

### Community 72 - "Task phase tracker"
Cohesion: 0.15
Nodes (12): candidatesProduced, collectedBy, conflictsFound, endedAt, parameters, basis, change, domains (+4 more)

### Community 73 - "Node rewrite bundle"
Cohesion: 0.22
Nodes (7): build_ilo_from_fil(), extract_lang_dict(), is_bad_translation(), main(), build_lang_block(), replace_lang_block(), should_keep()

### Community 74 - "Sensor sweep notes"
Cohesion: 0.18
Nodes (8): CacheManager, CONFIG, ExchangeRateService, formatCurrencyDisplay(), formatExchangeRate(), InfoBarManager, TimeService, WeatherService

### Community 75 - "Edit plus frame protocol"
Cohesion: 0.30
Nodes (11): animateValue(), calcPercent(), FINANCIAL_DATA, formatPeso(), highlightChartSegment(), init(), initBreakdownInteractions(), initCharts() (+3 more)

### Community 76 - "Color batch toggles"
Cohesion: 0.23
Nodes (6): extract_lang_dict(), main(), build_lang_block(), replace_lang_block(), should_keep_as_is(), translate_text()

### Community 77 - "Handoff channel roles"
Cohesion: 0.18
Nodes (8): CacheManager, CONFIG, ExchangeRateService, formatCurrencyDisplay(), formatExchangeRate(), InfoBarManager, TimeService, WeatherService

### Community 78 - "AGENTS agent role docs"
Cohesion: 0.30
Nodes (11): animateValue(), calcPercent(), FINANCIAL_DATA, formatPeso(), highlightChartSegment(), init(), initBreakdownInteractions(), initCharts() (+3 more)

### Community 79 - "Logger serialization cycle"
Cohesion: 0.24
Nodes (8): healthFixture(), healthRecord(), srcDoc(), buildDomainJson(), fbSource(), fixtureTree(), newsRecord(), srcDoc()

### Community 80 - "Color mode protocol"
Cohesion: 0.31
Nodes (11): acceptedDomAlreadyClean(), clearHandledWrapperReloadStamp(), deferredRecoverySuperseded(), ensureAcceptedDomClean(), findAcceptedRuntimeWrappers(), handledWrapperReloadKey(), reloadAfterMissingAcceptedDom(), restoreAcceptedDomFromSnapshot() (+3 more)

### Community 81 - "Opacity trace protocol"
Cohesion: 0.18
Nodes (10): config:recommended, enabledManagers, extends, lockFileMaintenance, enabled, packageRules, rangeStrategy, schedule (+2 more)

### Community 82 - "Toast opacity request"
Cohesion: 0.20
Nodes (7): gsap, @gsap/react, HistoryQuiz(), LetterIcon(), Phase, QuizQuestion, Selection

### Community 83 - "Sidebar toggle orchestration"
Cohesion: 0.24
Nodes (10): main(), DATASET_BODY, DIRECTORY_BODY, errorsOf(), fm(), GAP_BODY, REGISTER, tree() (+2 more)

### Community 84 - "Effects menu guard"
Cohesion: 0.42
Nodes (8): Line, parseBlock(), parseMapping(), parseScalar(), parseSequence(), parseYamlSubset(), splitPair(), tokenize()

### Community 85 - "Haste data matching"
Cohesion: 0.33
Nodes (8): collectSourceFiles(), main(), ProvenanceFinding, ProvenanceOptions, SCAN_EXTENSIONS, scanForClaims(), scanText(), SKIP_DIRS

### Community 86 - "Panel speech protocol"
Cohesion: 0.24
Nodes (9): CSV_REL, EXPECTED_IDS, loadCsv(), MD_REL, registerIds(), splitCsvLine(), extractTables(), isDelimiter() (+1 more)

### Community 87 - "Tradeoff attribute rules"
Cohesion: 0.27
Nodes (7): formatNewsDate(), Hero3DLogo, HomePage(), NEWS_MONTHS, newsBadgeClass(), NewsItem, SearchAutocompleteHandle

### Community 88 - "Split pointer tracing"
Cohesion: 0.61
Nodes (8): esc(), formatDate(), loadNews(), renderHomeNews(), renderNewsPage(), safeBadge(), safeUrl(), sortByDateDesc()

### Community 90 - "Kit budget flash"
Cohesion: 0.61
Nodes (8): esc(), formatDate(), loadNews(), renderHomeNews(), renderNewsPage(), safeBadge(), safeUrl(), sortByDateDesc()

### Community 91 - "Autocomplete trace checks"
Cohesion: 0.22
Nodes (8): bo, dem, demByName, POBLACION, SHARED_TELS, sum2015, sum2020, unmatched

### Community 92 - "Session parameter rollback"
Cohesion: 0.46
Nodes (7): fetchResolutions(), formatResolutionNo(), formatSessionDate(), getResolutionYear(), initResolutionTable(), renderResolutionTable(), sortResolutionsByNumber()

### Community 93 - "Tracker deletion checks"
Cohesion: 0.36
Nodes (7): animateBars(), charts, COLORS, createExpenditureChart(), createIncomeChart(), initCharts(), initScrollAnimations()

### Community 94 - "Template skip zones"
Cohesion: 0.46
Nodes (7): dismiss(), getFocusable(), init(), lockScroll(), measureScrollbarWidth(), trapFocus(), unlockScroll()

### Community 96 - "Design token exports"
Cohesion: 0.25
Nodes (8): Canonical civic records, Civic refresh pipeline, Source registry, CI verification contract, Compat generation, Compat generation spec, Civic pipeline spec, Research evidence contract

### Community 97 - "Drawer resize trims"
Cohesion: 0.25
Nodes (8): Research Category Checklist, Research Data Integration Design, Research Data Integration Proposal, Civic Data Surfacing Spec, Research Data Integration Tasks, Site Enhancements Design, Site Enhancements Proposal, Site Enhancements Tasks

### Community 98 - "Clip path tooltip style"
Cohesion: 0.46
Nodes (7): fetchResolutions(), formatResolutionNo(), formatSessionDate(), getResolutionYear(), initResolutionTable(), renderResolutionTable(), sortResolutionsByNumber()

### Community 99 - "Toast undo cleanup"
Cohesion: 0.36
Nodes (7): animateBars(), charts, COLORS, createExpenditureChart(), createIncomeChart(), initCharts(), initScrollAnimations()

### Community 100 - "Portal rebuild cleanup"
Cohesion: 0.46
Nodes (7): dismiss(), getFocusable(), init(), lockScroll(), measureScrollbarWidth(), trapFocus(), unlockScroll()

### Community 101 - "Delete file helpers"
Cohesion: 0.25
Nodes (6): Serwist Worker, dynamic, manifest(), HistoryQuiz, metadata, QuizPage()

### Community 102 - "Exit mask porting"
Cohesion: 0.25
Nodes (8): LGU departments offices page, Province Res 287-2023 appropriation, Province Res 304-2025 appropriation, Province Res 375-2024 appropriation, BLGF gap report appropriations, Budget FY2009-FY2016 income, Full Disclosure Seal Charter, PSA PhilAtlas census fixture

### Community 103 - "Checkbox hover polish"
Cohesion: 0.39
Nodes (7): baseRecord(), baseRegistry(), baseSource(), cleanup(), expectError(), Fixture, writeTree()

### Community 104 - "Toast timing paths"
Cohesion: 0.36
Nodes (5): build_ilo_from_fil(), extract_lang_dict(), main(), build_lang_block(), replace_lang_block()

### Community 105 - "Bug pointer editing"
Cohesion: 0.36
Nodes (5): build_ilo_from_fil(), extract_lang_dict(), main(), build_lang_block(), replace_lang_block()

### Community 106 - "Frame file shortcuts"
Cohesion: 0.32
Nodes (6): CouncilorCard(), data, Official, OfficialCard(), OfficialsData, OfficialsPage()

### Community 107 - "Toast panel tones"
Cohesion: 0.39
Nodes (6): getManilaNow(), InfoBar(), MONTHS, buildUrl(), CurrentWeatherResponse, fetchCurrentWeather()

### Community 108 - "Layer panel undo"
Cohesion: 0.29
Nodes (7): Better San Carlos civic portal, Impeccable OpenAI interface, Responsive adapt, Native adapt, Android Material, Impeccable craft, Better San Carlos initiative

### Community 109 - "Hotspot slider traces"
Cohesion: 0.29
Nodes (7): Documenter, Optimize guide, Polish pass, Quiet design, Routing menu, Typeset type, Redesign audit

### Community 110 - "Dropdown selection tabs"
Cohesion: 0.52
Nodes (6): globToRegex(), matchesScope(), normalizeIgnoreRule(), normalizeIgnoreValue(), pageCandidates(), resolveDetectIgnores()

### Community 111 - "Font family listener"
Cohesion: 0.52
Nodes (6): fetchOrdinances(), formatOrdinanceNo(), formatSessionDate(), initOrdinanceTable(), renderOrdinanceTable(), sortOrdinancesByNumber()

### Community 113 - "Cursor handling paths"
Cohesion: 0.29
Nodes (7): Bamboo Green Mango Yellow palette, Rebrand change marker, Rebrand to Bamboo Green proposal, Brand tokens source of truth, Token exclusivity migration, Design polish change marker, Design audit polish proposal

### Community 114 - "Slot selection fixes"
Cohesion: 0.52
Nodes (6): fetchOrdinances(), formatOrdinanceNo(), formatSessionDate(), initOrdinanceTable(), renderOrdinanceTable(), sortOrdinancesByNumber()

### Community 116 - "Card animation overlays"
Cohesion: 0.33
Nodes (6): Apply change, Archive change, Explore stance, Propose workflow, Sync specs, Update change

### Community 117 - "Audio thumbnail strips"
Cohesion: 0.40
Nodes (5): Renovate dependency bot, CI verify workflow, CI pipeline change marker, CI pipeline proposal, CI verification contract

### Community 118 - "Viewer camera values"
Cohesion: 0.40
Nodes (5): PhilHealth hosp 073126 evidence, Mango-Bamboo Festival research, Tourist Attractions directory, Public Transport profile, Province San Carlos profile fixture

### Community 119 - "Selection copy bugs"
Cohesion: 0.50
Nodes (4): Asset producer, Overdrive mode, Shape brief, Visualize comps

### Community 121 - "Winding slider polish"
Cohesion: 0.50
Nodes (4): Clock to Timer migration, Weather request fix, Console weather fix marker, Console and weather defects proposal

### Community 122 - "Team craft docs"
Cohesion: 0.67
Nodes (4): Quiz Game Design, Quiz Game Proposal, History Quiz Spec, Quiz Game Tasks

### Community 123 - "Team craft protocol docs"
Cohesion: 0.50
Nodes (4): Civic Data Pipeline Design, Civic Data Pipeline Proposal, CI Verification Spec, Civic Data Pipeline Tasks

### Community 124 - "Design revision loop"
Cohesion: 0.50
Nodes (4): Res 287 2023 Unparsable, Res 304 2025 Unparsable, Public Transport and Mobility, Province Profile Fixture

### Community 131 - "Seasonal rebalance rounds"
Cohesion: 0.67
Nodes (3): Animated icon placement limit, Budget invisible body fix, Visual design system contract

### Community 132 - "Verification artifact dumps"
Cohesion: 0.67
Nodes (3): PWA chrome brand colors, Missing PWA icons generation, Console and weather verification gates

### Community 133 - "Simulated check runs"
Cohesion: 0.67
Nodes (3): Hero Logo Asset v1, Meshopt Requirement, Single Asset Requirement

### Community 134 - "Spot verification logs"
Cohesion: 0.67
Nodes (3): Bamboo Mango palette, Icon system, Visual system

### Community 136 - "Crawler and branding metadata"
Cohesion: 0.67
Nodes (3): OpenGraph banner, Abakada footer mark, Robots policy

## Ambiguous Edges - Review These
- `Public Utilities Profile` → `PhilHealth Unparsable`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/philhealth-hosp-073126.pdf · relation: conceptually_related_to
- `Province Profile Fixture` → `Res 287 2023 Unparsable`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/province-res-287-2023.pdf · relation: conceptually_related_to
- `Province Profile Fixture` → `Res 304 2025 Unparsable`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/province-res-304-2025.pdf · relation: conceptually_related_to
- `Tourist Attractions directory` → `PhilHealth hosp 073126 evidence`  [AMBIGUOUS]
  research/runs/2026-09-16/evidence/philhealth-hosp-073126.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **144 isolated node(s):** `lottie-web`, `react-dom`, `shadcn`, `tw-animate-css`, `@tailwindcss/postcss` (+139 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 751 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **100 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handleClick()` connect `Svelte injection mount flow` to `Manual editing canvas tools`, `Landing hero slideshow`, `Insert session recovery state`, `Configure bar parameter UI`, `Gateway index and deploy`, `Annotation payload types`, `Svelte component insertion`, `Inline edit copy flow`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **What connects `lottie-web`, `react-dom`, `shadcn` to the rest of the system?**
  _144 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Manual editing canvas tools` be split into smaller, more focused modules?**
  _Cohesion score 0.03251591925213386 - nodes in this community are weakly interconnected._
- **Why does `SearchAutocomplete` connect `Landing hero slideshow` to `Svelte injection mount flow`, `Tradeoff attribute rules`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Should `Evidence collectors and parsers` be split into smaller, more focused modules?**
  _Cohesion score 0.05318352059925094 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Public Utilities Profile` and `PhilHealth Unparsable`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Province Profile Fixture` and `Res 287 2023 Unparsable`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._