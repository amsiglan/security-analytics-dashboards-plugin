/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

interface FilterOption {
  id: string;
  label: string;
}

interface Finding {
  id: string;
  related_doc_ids: string[];
  monitor_id: string;
  monitor_name: string;
  index: string;
  queries: Query[];
  document_list: Document[];
}

interface Query {
  id: string;
  name: string;
  query: string;
  tags: string[];
}

interface Document {
  id: string;
  index: string;
  found: boolean;
  document: string;
}
