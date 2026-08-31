'use client';

import PageHeader from '@/components/layout/PageHeader';

export default function BudgetPage() {
    return (
        <>
            <PageHeader
                title="Budget & Financial Transparency"
                description="Tracking municipal finances and projects for accountability"
                badge={{ icon: 'bi bi-shield-check', label: 'Financial Transparency' }}
                breadcrumbs={[
                    { label: 'nav-home', href: '/' },
                    { label: 'Budget & Transparency' },
                ]}
            />

            <section className="sre-section-v2 animate-on-scroll">
                <div className="container">
                    <div className="sre-header-v2">
                        <div className="sre-title-group">
                            <span className="sre-label">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Financial Report</span>
                            </span>
                            <h2>Statement of Receipts &amp; Expenditures</h2>
                            <p>FY 2025 quarterly financial performance</p>
                        </div>
                        <div className="sre-period-toggle" role="tablist" aria-label="Select fiscal quarter">
                            <button
                                type="button"
                                className="sre-period-btn active"
                                role="tab"
                                aria-selected="true"
                                data-quarter="q1"
                            >
                                <span className="sre-period-q">Q1</span>
                                <span className="sre-period-range">Jan - Mar</span>
                            </button>
                            <button
                                type="button"
                                className="sre-period-btn"
                                role="tab"
                                aria-selected="false"
                                data-quarter="q2"
                            >
                                <span className="sre-period-q">Q2</span>
                                <span className="sre-period-range">Apr - Jun</span>
                            </button>
                        </div>
                    </div>
                    <div className="sre-metrics-row">
                        <div className="sre-metric-card sre-metric-income">
                            <div className="sre-metric-icon"><i className="bi bi-arrow-down-circle"></i></div>
                            <div className="sre-metric-data">
                                <span className="sre-metric-value" id="sre-total-income">₱158.47 M</span>
                                <span className="sre-metric-label">Total Income</span>
                            </div>
                        </div>
                        <div className="sre-metric-card sre-metric-expense">
                            <div className="sre-metric-icon"><i className="bi bi-arrow-up-circle"></i></div>
                            <div className="sre-metric-data">
                                <span className="sre-metric-value" id="sre-total-expense">₱67.51 M</span>
                                <span className="sre-metric-label">Total Expenditures</span>
                            </div>
                        </div>
                        <div className="sre-metric-card sre-metric-net">
                            <div className="sre-metric-icon"><i className="bi bi-plus-slash-minus"></i></div>
                            <div className="sre-metric-data">
                                <span className="sre-metric-value" id="sre-net-income">₱90.96 M</span>
                                <span className="sre-metric-label">Net Operating Income</span>
                            </div>
                        </div>
                        <div className="sre-metric-card sre-metric-balance">
                            <div className="sre-metric-icon"><i className="bi bi-wallet2"></i></div>
                            <div className="sre-metric-data">
                                <span className="sre-metric-value" id="sre-fund-balance">₱283.29 M</span>
                                <span className="sre-metric-label">Fund Balance (End)</span>
                            </div>
                        </div>
                    </div>

                    <div className="sre-breakdown-v2">
                        <div className="sre-breakdown-panel">
                            <div className="sre-panel-header">
                                <h3>
                                    <i className="bi bi-pie-chart"></i>
                                    <span>Income Sources</span>
                                </h3>
                            </div>
                            <div className="sre-panel-body">
                                <div className="sre-chart-container">
                                    <canvas id="incomeChartV2"></canvas>
                                </div>
                                <div className="sre-breakdown-list">
                                    <div className="sre-breakdown-item" data-type="local">
                                        <span className="sre-item-indicator sre-indicator-local"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">Local Sources</span>
                                            <span className="sre-item-detail">Tax &amp; Non-Tax Revenue</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-income-local">₱88.85 M</span>
                                            <span className="sre-item-pct" id="sre-income-local-pct">56.1%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item" data-type="external">
                                        <span className="sre-item-indicator sre-indicator-external"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">External Sources</span>
                                            <span className="sre-item-detail">National Tax Allotment</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-income-external">₱69.62 M</span>
                                            <span className="sre-item-pct" id="sre-income-external-pct">43.9%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sre-breakdown-panel">
                            <div className="sre-panel-header">
                                <h3>
                                    <i className="bi bi-bar-chart"></i>
                                    <span>Expenditure Allocation</span>
                                </h3>
                            </div>
                            <div className="sre-panel-body">
                                <div className="sre-chart-container">
                                    <canvas id="expenditureChartV2"></canvas>
                                </div>
                                <div className="sre-breakdown-list">
                                    <div className="sre-breakdown-item" data-type="gps">
                                        <span className="sre-item-indicator sre-indicator-gps"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">General Public Services</span>
                                            <span className="sre-item-detail">Administration &amp; Operations</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-exp-gps">₱42.76 M</span>
                                            <span className="sre-item-pct" id="sre-exp-gps-pct">63.3%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item" data-type="social">
                                        <span className="sre-item-indicator sre-indicator-social"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">Social Services</span>
                                            <span className="sre-item-detail">Health, Education, Welfare</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-exp-social">₱13.33 M</span>
                                            <span className="sre-item-pct" id="sre-exp-social-pct">19.7%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item" data-type="economic">
                                        <span className="sre-item-indicator sre-indicator-economic"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">Economic Services</span>
                                            <span className="sre-item-detail">Infrastructure &amp; Development</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-exp-economic">₱11.07 M</span>
                                            <span className="sre-item-pct" id="sre-exp-economic-pct">16.4%</span>
                                        </div>
                                    </div>
                                    <div className="sre-breakdown-item" data-type="debt">
                                        <span className="sre-item-indicator sre-indicator-debt"></span>
                                        <div className="sre-item-info">
                                            <span className="sre-item-name">Debt Service</span>
                                            <span className="sre-item-detail">Interest &amp; Charges</span>
                                        </div>
                                        <div className="sre-item-values">
                                            <span className="sre-item-amount" id="sre-exp-debt">₱0.35 M</span>
                                            <span className="sre-item-pct" id="sre-exp-debt-pct">0.5%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="sre-source">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a
                            href="https://blgf.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Bureau of Local Government Finance (BLGF)
                        </a>
                    </p>
                </div>
            </section>

            <section className="infra-section-v5 animate-on-scroll">
                <div className="container">
                    <div className="infra-header-v5">
                        <span className="infra-label-v5">
                            <i className="bi bi-building-gear"></i>
                            <span>Public Works</span>
                        </span>
                        <h2>Infrastructure Investments</h2>
                        <p>Major development projects serving the community</p>
                    </div>
                    <div className="infra-project-v5">
                        <div className="infra-project-main">
                            <div className="infra-project-tags">
                                <span className="infra-tag-year">2024</span>
                                <span className="infra-tag-category">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3>FCDS Package 5 - Magat River Flood Control</h3>
                            <p className="infra-location">
                                <i className="bi bi-geo-alt"></i>
                                <span>Magat River, Bagahabag Section, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="infra-project-details">
                            <div className="infra-detail-row">
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Type of Work</span>
                                    <span className="infra-detail-value">Construction of Flood Mitigation Structure</span>
                                </div>
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Contractor</span>
                                    <span className="infra-detail-value">EGB Construction Corporation</span>
                                </div>
                                <div className="infra-detail-col infra-detail-cost">
                                    <span className="infra-detail-label">Contract Cost</span>
                                    <span className="infra-detail-value">₱144,750,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="infra-project-footer">
                            <span className="infra-source">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="infra-link"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>

                    <div className="infra-project-v5">
                        <div className="infra-project-main">
                            <div className="infra-project-tags">
                                <span className="infra-tag-year">2021</span>
                                <span className="infra-tag-category">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3>Repair/Rehabilitation of Flood Control and Drainage Structure - Section 1</h3>
                            <p className="infra-location">
                                <i className="bi bi-geo-alt"></i>
                                <span>Magat River, Bangar Section 1, Brgy. Bangar, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="infra-project-details">
                            <div className="infra-detail-row">
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Type of Work</span>
                                    <span className="infra-detail-value">Rehabilitation / Major Repair of Flood Control Structure</span>
                                </div>
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Contractor</span>
                                    <span className="infra-detail-value">Shanley Construction</span>
                                </div>
                                <div className="infra-detail-col infra-detail-cost">
                                    <span className="infra-detail-label">Contract Cost</span>
                                    <span className="infra-detail-value">₱29,700,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="infra-project-footer">
                            <span className="infra-source">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="infra-link"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>

                    <div className="infra-project-v5">
                        <div className="infra-project-main">
                            <div className="infra-project-tags">
                                <span className="infra-tag-year">2021</span>
                                <span className="infra-tag-category">
                                    <i className="bi bi-water"></i>
                                    <span>Flood Control</span>
                                </span>
                            </div>
                            <h3>Repair/Rehabilitation of Flood Control and Drainage Structure - Section 2</h3>
                            <p className="infra-location">
                                <i className="bi bi-geo-alt"></i>
                                <span>Magat River, Bangar Section 2, Brgy. Bangar, San Carlos City, Pangasinan</span>
                            </p>
                        </div>
                        <div className="infra-project-details">
                            <div className="infra-detail-row">
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Type of Work</span>
                                    <span className="infra-detail-value">Rehabilitation / Major Repair of Flood Control Structure</span>
                                </div>
                                <div className="infra-detail-col">
                                    <span className="infra-detail-label">Contractor</span>
                                    <span className="infra-detail-value">Shanley Construction</span>
                                </div>
                                <div className="infra-detail-col infra-detail-cost">
                                    <span className="infra-detail-label">Contract Cost</span>
                                    <span className="infra-detail-value">₱29,700,000</span>
                                </div>
                            </div>
                        </div>
                        <div className="infra-project-footer">
                            <span className="infra-source">
                                <i className="bi bi-info-circle"></i>
                                <span>Source: Sumbong sa Pangulo</span>
                            </span>
                            <a
                                href="https://sumbongsapangulo.ph/flood-control-map/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="infra-link"
                            >
                                <i className="bi bi-arrow-up-right"></i>
                                <span>View on Map</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="infra-section-v5 infra-section-alt animate-on-scroll">
                <div className="container">
                    <div className="infra-header-v5">
                        <span className="infra-label-v5">
                            <i className="bi bi-building"></i>
                            <span>National Government Projects</span>
                        </span>
                        <h2>DPWH Infrastructure Projects in San Carlos</h2>
                        <p>Implementing Agency: Pangasinan District Engineering Office</p>
                    </div>

                    <div id="dpwh-projects-container"></div>

                    <p className="sre-source dpwh-source-margin">
                        <i className="bi bi-info-circle"></i> Source:{" "}
                        <a
                            href="https://transparency.dpwh.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            DPWH Transparency Portal
                        </a>
                    </p>
                </div>
            </section>
        </>
    );
}
