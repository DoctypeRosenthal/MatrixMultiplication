/*
 * Dynamische Veränderungen des HTML, 
 * Aufbau und Wertzuweisungen des Daten-Objektes, das die Matrix repräsentiert (s. math.js)
 * 
 * Es ist bei dem Programm wichtig, dass man unterscheidet zwischen der Matrix 
 * 1) in Tabellenform und
 * 2) in Object-Form.
 * 
 * Elemente von 1) werden immer in HTML-Schreibweise wie thisTD, thisTABLE etc. benannt,
 * wobei Elemente von 2) immer mit Matrix-Begriffen wie thisMatrix, thisRow, thisCol etc. bezeichnet werden.
 * 
 * Ich habe versucht, alle HTML-Operationen in diese Datei zu legen und alle
 * Object-Operationen in math.js. Es ist jedoch nicht immer praktisch, diese Trennung
 * rigoros durchzuziehen, weshalb manchmal beide Objekte (das HTML- und das JavaScript-Object)
 * in einer Datei angesprochen werden.
 */

	var
	allMatrices = document.getElementsByClassName ('matrix'),
	OperationsDIV =
	// die Box mit den elementaren Umformungen
	{
		Box : document.getElementById ('row-operations'),
		show : function ()
		// zeigt die Box neben einer Matrix an
		{
			var
			MatrixNr = parseInt(this.getAttribute ('data-matrix'));
		
			// der Box die Matrix.ID zuweisen
			OperationsDIV.Box.setAttribute ('data-matrix', MatrixNr);
					
			// die Box neben der Matrix anzeigen
			OperationsDIV.Box.style.left = this.offsetLeft + this.offsetWidth + 10 + 'px';
			OperationsDIV.Box.style.top = this.offsetTop + 'px';
			OperationsDIV.Box.style.visibility = 'visible';
			TweenLite.to (OperationsDIV.Box, 0.5, {opacity: 0.9});
		},
		hide : function ()
		// versteckt die Box
		{
			OperationsDIV.Box.style.opacity = 0;
			OperationsDIV.Box.style.visibility = 'hidden';
		}
	}; // OperationsDIV
	
	for (i = 0; allMatrices[i]; i++)
	{
		var inputs = allMatrices[i].getElementsByTagName('input');
		// jedem Matrix-Input Event-Handler zuweisen
		for (j = 0; inputs[j]; j++) {
			inputs[j].value = "0";
			inputs[j].addEventListener ('keydown', buildMatrix);
			inputs[j].addEventListener ('keydown', function ()
			// passt die Größe des Inputs dynamisch an
			{
				this.style.width = Math.sqrt(this.value.length) * 2 + 'em';
				// verschiebt die row-operations Box dynamisch
				this.parentNode.parentNode.parentNode.parentNode.onmouseover();
			});
			inputs[j].addEventListener ('keydown', OperationsDIV.hide);
			// das Daten-Objekt updaten
			inputs[j].onblur = Matrix.update; 
		}
	}  // for-Loop

function buildMatrix (event) 
// erweitert die HTML- und die Daten-Objekt-Matrix um Zeilen und Spalten
{
	var
	buildCol = function (row, col)
	// erstellt für jede vorhandene Zeile eine neue Spalte mit Element
	{
		var
		/* falls row/col als Argument übergeben wurde, Werte übernehmen. 
		*  Sonst die Werte aus dem Daten-Objekt nehmen */
		dataRow = row || thisMatrix.rows,
		dataCol = col || thisMatrix.cols,
		
		// HTML-Element erstellen
		TD = document.createElement ('td'),
		INPUT = document.createElement ('input');
		
		// Wertzuweisung an die neue Spalte des Daten-Objektes
		thisMatrix[row][col] = 0;
		
		// Attribute setzen
		INPUT.addEventListener ('keydown', buildMatrix);
		INPUT.addEventListener ('keydown', function ()
		{
			// passt die Größe des Inputs dynamisch an
			this.style.width = Math.sqrt(this.value.length) * 2 + 'em';
			// verschiebt die row-operations Box dynamisch
			thisTABLE.onmouseover();
		});
		INPUT.onblur = Matrix.update;
		INPUT.value = "0";
		
		// neues Element zusammenbauen und zurückgeben
		TD.appendChild (INPUT);
		TD.setAttribute ('data-matrix', MatrixID);
		TD.setAttribute ('data-row', dataRow);
		TD.setAttribute ('data-col', dataCol);
		TD.focus ();
		
		return TD;
	}, // buildMTD () 
	
	buildRow = function ()
	// neue Matrix-Zeile erzeugen
	{
		var
		row = thisMatrix.rows,
		col = thisMatrix.cols,
		TD,
		TR = document.createElement ('tr');
		
		// neue Zeile im Daten-Objekt erstellen
		thisMatrix[row] = {};
		
		for (i = 1; i <= col; i ++)
		// alle Spalten erzeugen und an neue Zeile anhängen
		{
			TD = buildCol (row, i);
			TR.appendChild (TD);
		}
		return TR;
	}, // buildMTR () 
	
	Key = event.keyCode;
	
	if (Key == 32 || Key == 13) // Leertaste oder Enter gedrückt
	// Matrizeneinträge erstellen und löschen
	{
		// Leerzeichen verhindern
		event.preventDefault ();
		
		var
		MatrixID = parseInt(this.parentNode.getAttribute('data-matrix')),
		thisMatrix = Matrix[MatrixID], // aktuelles Matrix-Objekt
		thisRow = parseInt(this.parentNode.getAttribute('data-row')), // aktuelle Zeile
		thisCol = parseInt(this.parentNode.getAttribute('data-col')), // aktuelle Spalte
		thisTABLEBODY = this.parentNode.parentNode.parentNode;
		thisTABLE = thisTABLEBODY.parentNode;

		switch (Key) 
		{
			case 32: // Leertaste 
				if (event.ctrlKey && thisMatrix.cols > 1)
				// Spalte löschen
				{ 
					var colTDs = thisTABLE.getElementsByTagName ('td'); // alle TDs in dieser Spalte
					for ( i = 0; colTDs[i]; i++)
					// die Spalte aus der Tabelle löschen
					{ 
						if (parseInt(colTDs[i].getAttribute('data-col')) == thisCol)
							colTDs[i].parentNode.removeChild (colTDs[i]);
					}
					
					// Matrix-Objekt aktualisieren
					thisMatrix.delCol (thisCol);
					//~ console.log (thisMatrix);
				}
				else
				// neue Spalte
				{
					var 
					allTRs = thisTABLE.getElementsByTagName ('tr');
					
					thisMatrix.cols += 1;
					for (i = 1; i <= thisMatrix.rows; i++)
					// in jeder Zeile, eine Spalte anhängen
					{
						var newTD = buildCol (i, thisMatrix.cols);
						allTRs[i-1].appendChild (newTD);					
					}
				}
			break;
			
			case 13: // Enter
				if (event.ctrlKey && thisMatrix.rows > 1)
				// Zeile löschen
				{ 
					thisTR = this.parentNode.parentNode;
					thisTR.parentNode.removeChild (thisTR);
					// Matrix-Objekt
					thisMatrix.delRow (thisRow);
					//~ console.log (thisMatrix);
				}
				else
				// neue Zeile
				{
					thisMatrix.rows += 1;
					var newTR = buildRow ();
					// am Ende neue Zeile an's Markup anhängen
					thisTABLEBODY.appendChild (newTR);
					// neues Input fokussieren
					newTR.firstChild.lastChild.focus ();
				}
			break;
		}
		// Box für elementare Zeilenumformungen richtig ausrichten
		thisTABLE.onmouseover ();
	} // Enter oder Leertaste gedrückt
	
} // buildMatrix ()  -----------------------------------------------------

function outputHTML (Matrix)
// eine Matrix in MathML bauen
{
	var
	TABLE = document.createElement ('table'),
	TR,
	TD,
	value,
	protocol = document.getElementById('protocol');
	
	for (i = 1; i <= Matrix.rows; i++)
	{
		TR = document.createElement ('tr');
		for (j = 1; j <= Matrix.cols; j++)
		{
			TD = document.createElement ('td');
			if (typeof Matrix[i][j] == 'number')
				// es liegt eine Zahl vor
				value = Matrix[i][j];
			else
				// es liegt ein Bruch in Array-Form vor
				value = Matrix[i][j][0] + "/" + Matrix[i][j][1];
				
			TD.innerHTML = value;
			TR.appendChild (TD);
		}
		TABLE.appendChild (TR);
	}
	TABLE.className = "matrix";
	TABLE.setAttribute ('data-matrix', Matrix.ID);
	TABLE.onmouseover = OperationsDIV.show;
	// die Box für die Zeilenumfomung verstecken
	OperationsDIV.hide ();
	// neue Tabelle an's Protokoll anheften
	protocol.insertBefore (TABLE, protocol.firstChild);
	// Tabelle einfaden
	TABLE.style.opacity = 0;
	TweenLite.to (TABLE, 0.8, {opacity: 1});
} // outputHTML () -----------------------------------------------------


(function ()
{
	var
	matrixTABLES = document.getElementsByClassName ('matrix'),
	ABbtn = document.getElementById('AB-btn'),
	BAbtn = document.getElementById('BA-btn'),
	swapLines = document.getElementById ('swap-lines'),
	swapLinesBtn = swapLines.getElementsByTagName ('button')[0],
	addToLine = document.getElementById ('add-to-line'),
	addToLineBtn = addToLine.getElementsByTagName ('button')[0],
	multiplyLine = document.getElementById ('multiply-line'),
	multiplyLineBtn = multiplyLine.getElementsByTagName ('button')[0],
	closeOperations = document.getElementById('close-operations');
	
	// zwei Matrizen-Objekte erzeugen für die bereits bestehenden Tabellen der Matrix A und B
	for (i = 1; i <= 2; i++)
		Matrix.newMatrix ();
	
	for (i = 0; matrixTABLES[i]; i++)
		matrixTABLES[i].onmouseover = OperationsDIV.show;
		
	ABbtn.onclick = function ()
	{
		MatrixMultiplication (Matrix[1], Matrix[2]);
		outputHTML (Matrix[Matrix.MaxID]); // letzte Matrix ausgeben
	}

	BAbtn.onclick = function ()
	{
		MatrixMultiplication (Matrix[2], Matrix[1]);
		outputHTML (Matrix[Matrix.MaxID]);  // letzte Matrix ausgeben
	}

	swapLinesBtn.onclick = function ()
	{
		var
		MatrixNr = parseInt(swapLines.parentNode.getAttribute ('data-matrix')),
		inputs = swapLines.getElementsByTagName ('input'),
		ln1 = parseInt(inputs[0].value),
		ln2 = parseInt(inputs[1].value);
		
		if (!parseInt(inputs[0].value) || !parseInt(inputs[1].value))
		{
			alert ('Bitte zwei Zahlen eingeben!')
			return;
		}
		ElemRowOperations.swapRows (Matrix[MatrixNr], ln1, ln2);
		outputHTML (Matrix[Matrix.MaxID]); // letzte Matrix ausgeben
	}
	
	multiplyLineBtn.onclick = function ()
	{
		var
		MatrixNr = parseInt(swapLines.parentNode.getAttribute ('data-matrix')),
		inputs = multiplyLine.getElementsByTagName ('input'),
		ln = parseInt(inputs[0].value),
		s = parseInt(inputs[1].value);
		
		ElemRowOperations.multiplyRow (Matrix[MatrixNr], ln, s);
		outputHTML (Matrix[Matrix.MaxID]); // letzte Matrix ausgeben
	}
	
	addToLineBtn.onclick = function ()
	{
		var
		MatrixNr = parseInt(swapLines.parentNode.getAttribute ('data-matrix')),
		inputs = addToLine.getElementsByTagName ('input'),
		s = parseInt(inputs[0].value),
		ln1 = parseInt(inputs[1].value),
		ln2 = parseInt(inputs[2].value);
		
		ElemRowOperations.addToRow (Matrix[MatrixNr], ln1, ln2, s);
		outputHTML (Matrix[Matrix.MaxID]); // letzte Matrix ausgeben		
	}
	
	closeOperations.onclick = OperationsDIV.hide;
	
}) ();
