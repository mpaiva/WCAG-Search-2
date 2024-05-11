import WCAGGuidelines, {WCAGItem} from './wcag22-definitions';
import wcag22 from './wcag22.json'

// Runs this code if the plugin is run in Figma
  figma.showUI(__html__);
  async function searchWCAG(query: string) {
    performQuery(query)
  }
  
figma.ui.onmessage = msg => {
  if (msg.type === 'search-wcag') {
    console.log(msg.text);
    searchWCAG(msg.text);
  }
};

function performQuery(query: string) {
  const wcagObj = JSON.parse(wcag22.toString()) as WCAGGuidelines;
  const results = findInJson(wcagObj as WCAGItem[], query);
  let resultsHTML = ""
    if (results.length > 0) {
      results.forEach((item) => {
        let itemContent = `<h2>${item.ref_id} - ${item.title} (${item.level})</h2>
        <p>Description: ${item.description || 'No description available'}</p><p>URL: <a href="${item.url || '#'}" target="_blank">${item.url}</a></p>`;
        if (item.special_cases && item.special_cases.length > 0) {
          itemContent += "<p>Special Cases:<ul>";
          item.special_cases.forEach((caseItem) => {
            const caseTitle = caseItem.title || 'No title provided';
            const caseDescription = caseItem.description || ' ';
            itemContent += `<li>${caseTitle} ${caseDescription}</li>`;
          });
          itemContent += "</ul></p>";
        }
        if (item.notes && item.notes.length > 0) {
          itemContent += "Notes:<ul>";
          item.notes.forEach((note) => {
            const noteContent = note.content || 'No content available';
            itemContent += `<li>${noteContent}</li>`;
          });
          itemContent += "</ul>";
        }
        if (item.references && item.references.length > 0) {
          itemContent += "References:<br>";
          item.references.forEach((ref) => {
            itemContent += `<a href="${ref.url || '#'}" target="_blank">${ref.title || 'No title available'}</a><br>`;
          });
        }
        itemContent += `<br>`;
        resultsHTML += itemContent;
      });
    } else {
      resultsHTML = "No results found for your query.";
    }

    figma.ui.postMessage(resultsHTML)
}

function findInJson(items: WCAGItem[], query: string): WCAGItem[] {
  let results: WCAGItem[] = [];
  const lowerCaseQuery = query.toLowerCase();

  items.forEach((item) => {
    if ((item.ref_id && item.ref_id.toLowerCase().includes(lowerCaseQuery)) ||
        (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseQuery))) {
      results.push(item);
    }

    if (item.guidelines) {
      results = results.concat(findInJson(item.guidelines, lowerCaseQuery));
    }
    if (item.success_criteria) {
      results = results.concat(findInJson(item.success_criteria, lowerCaseQuery));
    }
    if (item.special_cases) {
      item.special_cases.forEach(specialCase => {
        if ((specialCase.title && specialCase.title.toLowerCase().includes(lowerCaseQuery)) ||
            (specialCase.description && specialCase.description.toLowerCase().includes(lowerCaseQuery))) {
          if (!results.includes(item)) {
            results.push(item);
          }
        }
        if (specialCase.special_cases) {
          results = results.concat(findInJson(specialCase.special_cases, lowerCaseQuery));
        }
      });
    }
  });

  return results;
}