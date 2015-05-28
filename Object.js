var
Matrix =
// Das Daten-Objekt, in dem alle Matrizen gespeichert sind
{
	MaxID : 0, // Anzahl der Matrizen
	
	newMatrix : function ()
	// neue Matrix anhängen
	{
		this.MaxID += 1; 
		this[this.MaxID] = 
		{
			ID : this.MaxID,
			rows : 1,
			cols : 1,
			delCol : function (theCol)
			// Spalte löschen
			{
				for (i = 1; i <= this.rows; i++)
				// die Spalte aus dem Matrix-Objekt löschen
				{
					/* alle Spalten ab der aktuellen Spalte eins nach vorne rücken. 
					 * So wird die aktuelle Spalte überschrieben */
					if (theCol < this.cols)
					// falls es nicht die letzte Spalte der Matrix ist
						for (j = theCol; j < this.cols; j++)
							this[i][j] = this[i][j + 1];
					// zu letzt, die letze Spalte löschen
					delete this[i][this.cols];
				}
				// Laufindex anpassen
				this.cols -= 1;
			},
			delRow : function (theRow)
			// Zeile löschen
			{
				if (theRow < this.rows)
				/* wenn es sich nicht um die letze Zeile handelt,
				 * alle Zeilen, die auf diese folgen, eins weiter nach vorne rücken
				 * und damit die aktuelle überschreiben */
					for (i = theRow; i < this.rows; i++)
						this[i] = this[i + 1];
				
				// zum Schluss, letzte Zeile löschen
				delete this[this.rows];
				this.rows -= 1;
			},
			
			1 : {1 : 0}
		}
	}, // newMatrix ()
	
	update : function (that)
	// neue Werte zu Elementen aus einer Matrix zuweisen
	{
		var
		thisMatrix = Matrix[parseInt(this.parentNode.getAttribute('data-matrix'))],
		row = parseInt(this.parentNode.getAttribute('data-row')),
		col = parseInt(this.parentNode.getAttribute('data-col')),
		value = this.value;
		
		if (value.indexOf("/") > 0) 
		// es liegt ein Bruch als String vor -> String in Bruch-Array umwandeln
			value = Fraction.parseFrac (value);
		else
		// sonst String in eine ganze Zahl umwandeln
			value = parseInt (value);
			
		thisMatrix[row][col] = value; // Wert updaten
		console.log(thisMatrix);
	},

	nullRow : function (M, row)
	// macht die Zeile row der Matrix M zur Nullzeile
	{
		for (j = 1; j <= M.cols; j++)
			M[row][j] = 0;
	},
	
	E : // Elementarmatrix
		{
			setN : function (n)
			// Matrix zurücksetzen und Zeilen- & Spaltenanzahl festlegen
			{
				this.rows = n;
				this.cols = n;
				
				for (i = 1; i <= n; i++)
				{
					// falls Zeile noch nicht existiert, neu anlegen
					if(!this[i]) this[i] = {};
					for (j =1; j <= n; j++)
						// Diagonalelemente = 1, Rest = 0
						this[i][j] = i == j ? 1 : 0;
				}
			},
			rows : 1,
			cols : 1,
			1 : {1 : 1}
		}
}; // Matrix  -----------------------------------------------------

// Beispiel: neue Zeile mit Wert 1 in der ersten Spalte einer Matrix hinzufügen
//~ var
//~ row = {1 : 1};
//~ Matrix[1][2] = row;

// Beispiel des Zugriffs: der erste Index ist die Matrix, der zweite ist die Zeile, der dritte die Spalte
//~ console.log(Matrix[1][2][1]);
